import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboard() {
    return this.reportsService.getDashboardStats();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  getRevenue(@Query('period') period: 'daily' | 'weekly' | 'monthly', @Query('year') year: number, @Query('month') month: number) {
    return this.reportsService.getRevenueReport(period || 'monthly', year, month);
  }

  @Get('bookings/trends')
  @ApiOperation({ summary: 'Get booking trends' })
  getBookingTrends(@Query('days') days: number) {
    return this.reportsService.getBookingTrends(days || 30);
  }

  @Get('packages/popular')
  @ApiOperation({ summary: 'Get popular packages' })
  getPopularPackages(@Query('limit') limit: number) {
    return this.reportsService.getPopularPackages(limit || 10);
  }

  @Get('tourists')
  @ApiOperation({ summary: 'Get tourist count report' })
  getTourists(@Query('period') period: 'daily' | 'monthly', @Query('year') year: number) {
    return this.reportsService.getTouristReport(period || 'monthly', year);
  }
}
