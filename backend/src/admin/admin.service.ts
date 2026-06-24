import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async promoteUser(userId: string, role: Role) {
    return this.prisma.user.update({ where: { id: userId }, data: { role } });
  }

  async getAuditLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({ skip, take: limit, include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count(),
    ]);
    return { data, total, page, limit };
  }

  async createAuditLog(data: { userId?: string; action: string; entity: string; entityId?: string; oldData?: any; newData?: any; ipAddress?: string }) {
    return this.prisma.auditLog.create({ data });
  }

  async getSystemStats() {
    const [users, packages, bookings, reviews, payments] = await Promise.all([
      this.prisma.user.groupBy({ by: ['role'], _count: true }),
      this.prisma.package.groupBy({ by: ['status'], _count: true }),
      this.prisma.booking.groupBy({ by: ['status'], _count: true }),
      this.prisma.review.groupBy({ by: ['status'], _count: true }),
      this.prisma.payment.groupBy({ by: ['status'], _sum: { amount: true }, _count: true }),
    ]);
    return { users, packages, bookings, reviews, payments };
  }
}
