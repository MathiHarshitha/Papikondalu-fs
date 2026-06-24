import { IsString, IsEnum, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PackageCategory, PackageStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePackageDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ enum: PackageCategory }) @IsEnum(PackageCategory) category: PackageCategory;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() shortDescription: string;
  @ApiProperty() @IsString() duration: string;
  @ApiProperty() @IsNumber() durationDays: number;
  @ApiProperty() @IsNumber() durationNights: number;
  @ApiProperty() @IsString() startingPoint: string;
  @ApiProperty() @IsString() endingPoint: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() discountedPrice?: number;
  @ApiProperty() @IsNumber() @Min(1) capacity: number;
  @ApiProperty() itinerary: any;
  @ApiProperty({ type: [String] }) @IsArray() includedServices: string[];
  @ApiProperty({ type: [String] }) @IsArray() excludedServices: string[];
  @ApiProperty() @IsString() cancellationPolicy: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() highlights?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() meetingPoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() meetingPointLat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() meetingPointLng?: number;
  @ApiPropertyOptional({ enum: PackageStatus }) @IsOptional() @IsEnum(PackageStatus) status?: PackageStatus;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFeatured?: boolean;
}

export class UpdatePackageDto extends PartialType(CreatePackageDto) {}

export class PackageQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: PackageCategory }) @IsOptional() @IsEnum(PackageCategory) category?: PackageCategory;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() minPrice?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() maxPrice?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() minDays?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() maxDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sortOrder?: 'asc' | 'desc';
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
}
