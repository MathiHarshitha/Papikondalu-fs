import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalUsers, totalBookings, totalRevenue, activePackages,
      todayBookings, pendingPayments, upcomingTrips,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER', isActive: true } }),
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({ where: { status: PaymentStatus.SUCCESS }, _sum: { amount: true } }),
      this.prisma.package.count({ where: { status: 'ACTIVE' } }),
      this.prisma.booking.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED, travelDate: { gte: new Date() } } }),
    ]);

    return {
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      activePackages,
      todayBookings,
      pendingPayments,
      upcomingTrips,
    };
  }

  async getRevenueReport(period: 'daily' | 'weekly' | 'monthly', year?: number, month?: number) {
    const now = new Date();
    const y = year || now.getFullYear();
    const m = month || now.getMonth() + 1;

    if (period === 'daily') {
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59);
      const payments = await this.prisma.payment.findMany({
        where: { status: PaymentStatus.SUCCESS, paidAt: { gte: start, lte: end } },
        select: { amount: true, paidAt: true },
      });

      const byDay: Record<string, number> = {};
      payments.forEach((p) => {
        const day = p.paidAt!.toISOString().split('T')[0];
        byDay[day] = (byDay[day] || 0) + Number(p.amount);
      });
      return Object.entries(byDay).map(([date, revenue]) => ({ date, revenue })).sort((a, b) => a.date.localeCompare(b.date));
    }

    if (period === 'monthly') {
      const start = new Date(y, 0, 1);
      const end = new Date(y, 11, 31, 23, 59, 59);
      const payments = await this.prisma.payment.findMany({
        where: { status: PaymentStatus.SUCCESS, paidAt: { gte: start, lte: end } },
        select: { amount: true, paidAt: true },
      });

      const byMonth: Record<string, number> = {};
      payments.forEach((p) => {
        const mo = `${p.paidAt!.getFullYear()}-${String(p.paidAt!.getMonth() + 1).padStart(2, '0')}`;
        byMonth[mo] = (byMonth[mo] || 0) + Number(p.amount);
      });
      return Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue })).sort((a, b) => a.month.localeCompare(b.month));
    }

    return [];
  }

  async getBookingTrends(days = 30) {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const bookings = await this.prisma.booking.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true, status: true },
    });

    const byDay: Record<string, { total: number; confirmed: number; cancelled: number }> = {};
    bookings.forEach((b) => {
      const day = b.createdAt.toISOString().split('T')[0];
      if (!byDay[day]) byDay[day] = { total: 0, confirmed: 0, cancelled: 0 };
      byDay[day].total++;
      if (b.status === BookingStatus.CONFIRMED) byDay[day].confirmed++;
      if (b.status === BookingStatus.CANCELLED) byDay[day].cancelled++;
    });

    return Object.entries(byDay).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getPopularPackages(limit = 10) {
    return this.prisma.package.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true, totalBookings: true, avgRating: true, totalRatings: true, price: true },
      orderBy: { totalBookings: 'desc' },
      take: limit,
    });
  }

  async getTouristReport(period: 'daily' | 'monthly', year?: number) {
    const y = year || new Date().getFullYear();
    const start = new Date(y, 0, 1);
    const end = new Date(y, 11, 31);

    const bookings = await this.prisma.booking.findMany({
      where: { status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] }, travelDate: { gte: start, lte: end } },
      select: { travelDate: true, numberOfPersons: true },
    });

    if (period === 'monthly') {
      const byMonth: Record<string, number> = {};
      bookings.forEach((b) => {
        const mo = `${b.travelDate.getFullYear()}-${String(b.travelDate.getMonth() + 1).padStart(2, '0')}`;
        byMonth[mo] = (byMonth[mo] || 0) + b.numberOfPersons;
      });
      return Object.entries(byMonth).map(([month, tourists]) => ({ month, tourists }));
    }

    const byDay: Record<string, number> = {};
    bookings.forEach((b) => {
      const day = b.travelDate.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + b.numberOfPersons;
    });
    return Object.entries(byDay).map(([date, tourists]) => ({ date, tourists }));
  }
}
