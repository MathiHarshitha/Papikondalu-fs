import { IsString, IsEmail, IsMobilePhone, IsDateString, IsNumber, IsArray, ValidateNested, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PassengerDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() @Min(1) @Max(100) age: number;
  @ApiProperty() @IsString() gender: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aadhaarNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyContact?: string;
}

export class CreateBookingDto {
  @ApiProperty() @IsString() packageId: string;
  @ApiProperty() @IsDateString() travelDate: string;
  @ApiProperty({ type: [PassengerDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => PassengerDto) passengers: PassengerDto[];
  @ApiPropertyOptional() @IsOptional() @IsString() specialRequests?: string;
}

export class CancelBookingDto {
  @ApiProperty() @IsString() reason: string;
}
