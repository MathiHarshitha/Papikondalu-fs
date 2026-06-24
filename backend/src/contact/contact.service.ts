import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsString() message: string;
}

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contactMessage.create({ data: dto });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contactMessage.count(),
    ]);
    return { data, total, page, limit };
  }

  async markRead(id: string) {
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }
}
