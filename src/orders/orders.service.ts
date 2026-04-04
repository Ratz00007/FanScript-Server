import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto, OrderFilterDto } from './dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Get event and verify availability
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { ticketTiers: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Event is not available for purchase');
    }

    // Calculate totals and reserve tickets
    let subtotal = 0;
    const platformFeeRate = 0.08; // 8% platform fee

    const ticketsData = [];
    
    for (const item of dto.tickets) {
      const tier = event.ticketTiers.find(t => t.id === item.ticketTierId);
      
      if (!tier) {
        throw new NotFoundException(`Ticket tier not found: ${item.ticketTierId}`);
      }

      const available = tier.quantity - tier.sold;
      if (available < item.quantity) {
        throw new BadRequestException(`Not enough tickets available for ${tier.name}. Only ${available} left.`);
      }

      const tierTotal = tier.price * item.quantity;
      subtotal += tierTotal;

      // Create ticket records
      for (let i = 0; i < item.quantity; i++) {
        ticketsData.push({
          ticketTierId: tier.id,
          qrCode: uuidv4(),
          status: 'VALID',
        });
      }

      // Update sold count
      await this.prisma.ticketTier.update({
        where: { id: tier.id },
        data: { sold: { increment: item.quantity } },
      });
    }

    const platformFee = subtotal * platformFeeRate;
    const total = subtotal + platformFee;

    // Create order with tickets
    const order = await this.prisma.order.create({
      data: {
        userId,
        eventId: dto.eventId,
        subtotal,
        platformFee,
        total,
        currency: 'EUR',
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        tickets: {
          create: ticketsData,
        },
      },
      include: {
        event: {
          include: { venue: true, artist: true },
        },
        tickets: true,
      },
    });

    return order;
  }

  async findAll(userId: string, filters: OrderFilterDto) {
    const { page = 1, limit = 20, status } = filters;

    const where: any = { userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          event: { include: { venue: true, artist: true } },
          tickets: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        event: { include: { venue: true, artist: true } },
        tickets: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You do not own this order');
    }

    return order;
  }

  async processPayment(orderId: string, paymentIntentId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentIntentId,
        paymentStatus: PaymentStatus.SUCCEEDED,
        status: OrderStatus.COMPLETED,
        paidAt: new Date(),
      },
      include: {
        tickets: true,
        event: true,
      },
    });
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { tickets: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You do not own this order');
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed order');
    }

    // Release ticket quantities
    for (const ticket of order.tickets) {
      const tier = await this.prisma.ticketTier.findUnique({
        where: { id: ticket.ticketTierId },
      });
      
      await this.prisma.ticketTier.update({
        where: { id: ticket.ticketTierId },
        data: { sold: { decrement: 1 } },
      });
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
      },
    });
  }
}
