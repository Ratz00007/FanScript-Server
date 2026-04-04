import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseUUIDPipe, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderFilterDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new order (purchase tickets)' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() dto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  findAll(@Query() filters: OrderFilterDto, @Request() req) {
    return this.ordersService.findAll(req.user.id, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel order' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }
}
