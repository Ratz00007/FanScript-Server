import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'The Irish Sessions Live' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-12-14' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '20:00' })
  @IsString()
  time: string;

  @ApiPropertyOptional({ example: '19:30' })
  @IsOptional()
  @IsString()
  doorsOpen?: string;

  @ApiPropertyOptional({ example: '18+' })
  @IsOptional()
  @IsString()
  ageRestriction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artistId?: string;
}

export class UpdateEventDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doorsOpen?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageRestriction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ enum: EventStatus })
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class EventFilterDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ example: 'Dublin' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Ireland' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '2025-12-01' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 'jazz' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: EventStatus, default: EventStatus.PUBLISHED })
  @IsOptional()
  status?: EventStatus;
}
