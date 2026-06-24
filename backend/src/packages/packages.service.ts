import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreatePackageDto, UpdatePackageDto, PackageQueryDto } from './dto/package.dto';
import { paginate, createPaginatedResult } from '../common/utils/pagination.util';
import { PackageStatus } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }

  async create(dto: CreatePackageDto) {
    const slug = this.generateSlug(dto.name);
    const pkg = await this.prisma.package.create({
      data: { ...dto, slug, availableSeats: dto.capacity },
      include: { images: true },
    });
    await this.redis.invalidatePattern('packages:*');
    return pkg;
  }

  async findAll(query: PackageQueryDto & { adminMode?: boolean }) {
    const cacheKey = `packages:${JSON.stringify(query)}`;
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

    const {
      page = 1, limit = 12, search, category, minPrice, maxPrice,
      minDays, maxDays, sortBy = 'createdAt', sortOrder = 'desc', adminMode,
    } = query;
    const { skip, take } = paginate({ page, limit });

    const where: any = adminMode ? {} : { status: PackageStatus.ACTIVE };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ];
    if (category) where.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) where.price = { gte: minPrice, lte: maxPrice };
    if (minDays !== undefined || maxDays !== undefined) where.durationDays = { gte: minDays, lte: maxDays };

    const [data, total] = await Promise.all([
      this.prisma.package.findMany({
        where, skip, take,
        include: { images: { where: { isPrimary: true } } },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.package.count({ where }),
    ]);

    const result = createPaginatedResult(data, total, page, limit);
    await this.redis.setJson(cacheKey, result, 300);
    return result;
  }

  async findFeatured() {
    const cacheKey = 'packages:featured';
    const cached = await this.redis.getJson(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.package.findMany({
      where: { status: PackageStatus.ACTIVE, isFeatured: true },
      include: { images: { where: { isPrimary: true } } },
      take: 6,
      orderBy: { avgRating: 'desc' },
    });

    await this.redis.setJson(cacheKey, data, 600);
    return data;
  }

  async findOne(idOrSlug: string) {
    const pkg = await this.prisma.package.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: {
        images: { orderBy: { order: 'asc' } },
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { name: true, avatar: true } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async update(id: string, dto: UpdatePackageDto) {
    await this.findOne(id);
    const pkg = await this.prisma.package.update({ where: { id }, data: dto as any, include: { images: true } });
    await this.redis.invalidatePattern('packages:*');
    return pkg;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.package.update({ where: { id }, data: { status: PackageStatus.INACTIVE } });
    await this.redis.invalidatePattern('packages:*');
    return { message: 'Package deactivated' };
  }

  async addImages(packageId: string, images: Array<{ url: string; key: string; altText?: string; isPrimary?: boolean }>) {
    const created = await this.prisma.packageImage.createMany({
      data: images.map((img, i) => ({ ...img, packageId, order: i })),
    });
    await this.redis.invalidatePattern('packages:*');
    return created;
  }

  async checkAvailability(packageId: string, persons: number) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: packageId },
      select: { availableSeats: true, price: true, discountedPrice: true },
    });
    if (!pkg) throw new NotFoundException('Package not found');
    if (pkg.availableSeats < persons) throw new BadRequestException('Not enough seats available');
    const unitPrice = Number(pkg.discountedPrice || pkg.price);
    return { available: true, availableSeats: pkg.availableSeats, unitPrice, totalPrice: unitPrice * persons };
  }
}
