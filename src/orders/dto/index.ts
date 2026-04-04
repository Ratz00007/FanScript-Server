import { IsString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TicketItemDto {
  @ApiProperty()
  @IsString()
  ticketTierId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty({ type: [TicketItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketItemDto)
  tickets: TicketItemDto[];
}

export class OrderFilterDto {
  page?: number;
  limit?: number;
  status?: string;
}
