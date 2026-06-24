import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginate, createPaginatedResult } from '../common/utils/pagination.util';

const USER_SELECT = {
  id: true, name: true, email: true, phone: true, avatar: true,
  gender: true, dateOfBirth: true, address: true, city: true,
  state: true, pincode: true, role: true, isEmailVerified: true,
  isPhoneVerified: true, isActive: true, createdAt: true, updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, search?: string) {
    const { skip, take } = paginate({ page, limit });
    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' as any } }, { email: { contains: search, mode: 'insensitive' as any } }] }
      : {};
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take, select: USER_SELECT, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);
    return createPaginatedResult(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto, select: USER_SELECT });
  }

  async deactivate(id: string) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: { isActive: false }, select: USER_SELECT });
  }

  async getSavedPackages(userId: string) {
    return this.prisma.savedPackage.findMany({
      where: { userId },
      include: { package: { include: { images: { where: { isPrimary: true } } } } },
    });
  }

  async savePackage(userId: string, packageId: string) {
    return this.prisma.savedPackage.upsert({
      where: { userId_packageId: { userId, packageId } },
      create: { userId, packageId },
      update: {},
    });
  }

  async unsavePackage(userId: string, packageId: string) {
    await this.prisma.savedPackage.delete({ where: { userId_packageId: { userId, packageId } } });
    return { message: 'Package removed from saved list' };
  }
}
