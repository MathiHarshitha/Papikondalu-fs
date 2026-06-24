import { IsString, IsNumber, Min, Max, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewStatus } from '@prisma/client';

export class CreateReviewDto {
  @ApiProperty() @IsString() packageId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bookingId?: string;
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsNumber() @Min(1) @Max(5) rating: number;
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() photos?: string[];
}

export class ModerateReviewDto {
  @ApiProperty({ enum: ReviewStatus }) @IsEnum(ReviewStatus) status: ReviewStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() adminNote?: string;
}
