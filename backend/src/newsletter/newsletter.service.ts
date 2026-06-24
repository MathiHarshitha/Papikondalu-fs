import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: SubscribeDto) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email: dto.email } });
    if (existing && existing.isActive) throw new ConflictException('Already subscribed');
    if (existing) return this.prisma.newsletterSubscriber.update({ where: { email: dto.email }, data: { isActive: true, unsubscribedAt: null } });
    return this.prisma.newsletterSubscriber.create({ data: dto });
  }

  async unsubscribe(email: string) {
    await this.prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: false, unsubscribedAt: new Date() } });
    return { message: 'Unsubscribed successfully' };
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({ skip, take: limit, where: { isActive: true }, orderBy: { subscribedAt: 'desc' } }),
      this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);
    return { data, total, page, limit };
  }
}
