import { Controller, Get, Post, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user tickets' })
  findByUser(@Request() req) {
    return this.ticketsService.findByUser(req.user.id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get tickets by order' })
  findByOrder(@Param('orderId', ParseUUIDPipe) orderId: string, @Request() req) {
    return this.ticketsService.findByOrder(orderId, req.user.id);
  }

  @Get(':id/qr')
  @ApiOperation({ summary: 'Generate QR code for ticket' })
  generateQR(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.ticketsService.generateQRCode(id, req.user.id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel ticket' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.ticketsService.cancelTicket(id, req.user.id);
  }
}
