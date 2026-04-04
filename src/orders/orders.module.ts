import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [TicketsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
