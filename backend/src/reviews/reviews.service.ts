import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, ModerateReviewDto } from './dto/review.dto';
import { paginate, createPaginatedResult } from '../common/utils/pagination.util';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: { ...dto, userId },
      include: { user: { select: { name: true, avatar: true } } },
    });
    return review;
  }

  async findByPackage(packageId: string, page = 1, limit = 10) {
    const { skip, take } = paginate({ page, limit });
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { packageId, status: ReviewStatus.APPROVED },
        skip, take,
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { packageId, status: ReviewStatus.APPROVED } }),
    ]);
    return createPaginatedResult(data, total, page, limit);
  }

  async findAll(page = 1, limit = 10, status?: ReviewStatus) {
    const { skip, take } = paginate({ page, limit });
    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where, skip, take,
        include: { user: { select: { name: true, email: true } }, package: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);
    return createPaginatedResult(data, total, page, limit);
  }

  async moderate(id: string, dto: ModerateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.review.update({ where: { id }, data: dto });

    if (dto.status === ReviewStatus.APPROVED) {
      // Update package rating
      const stats = await this.prisma.review.aggregate({
        where: { packageId: review.packageId, status: ReviewStatus.APPROVED },
        _avg: { rating: true },
        _count: { id: true },
      });
      await this.prisma.package.update({
        where: { id: review.packageId },
        data: { avgRating: stats._avg.rating || 0, totalRatings: stats._count.id },
      });
    }

    return updated;
  }

  async delete(id: string, userId?: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (userId && review.userId !== userId) throw new ForbiddenException('Not authorized');
    return this.prisma.review.delete({ where: { id } });
  }
}
