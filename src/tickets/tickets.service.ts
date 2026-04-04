import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { TicketStatus } from '@prisma/client';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        ticketTier: {
          include: {
            event: {
              include: { venue: true, artist: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOrder(orderId: string, userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { orderId },
      include: {
        ticketTier: {
          include: { event: true },
        },
      },
    });

    if (!tickets.length) {
      throw new NotFoundException('Tickets not found');
    }

    // Verify ownership
    if (tickets[0].order?.userId !== userId) {
      throw new BadRequestException('You do not own these tickets');
    }

    return tickets;
  }

  async generateQRCode(ticketId: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        ticketTier: { include: { event: true } },
        order: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.order?.userId !== userId) {
      throw new BadRequestException('You do not own this ticket');
    }

    if (ticket.status !== TicketStatus.VALID) {
      throw new BadRequestException('Ticket is not valid');
    }

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qrCode, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    return {
      ticket,
      qrCode: qrCodeDataUrl,
    };
  }

  async validateTicket(qrCode: string, venueId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCode },
      include: {
        ticketTier: {
          include: {
            event: { include: { venue: true } },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Invalid ticket');
    }

    if (ticket.ticketTier.event.venueId !== venueId) {
      throw new BadRequestException('Ticket is for a different venue');
    }

    if (ticket.status === TicketStatus.USED) {
      return {
        valid: false,
        message: 'Ticket already used',
        ticket,
      };
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      return {
        valid: false,
        message: 'Ticket cancelled',
        ticket,
      };
    }

    // Mark as used
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.USED,
        usedAt: new Date(),
      },
    });

    return {
      valid: true,
      message: 'Valid ticket',
      ticket,
    };
  }

  async cancelTicket(ticketId: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { order: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.order?.userId !== userId) {
      throw new BadRequestException('You do not own this ticket');
    }

    if (ticket.status === TicketStatus.USED) {
      throw new BadRequestException('Cannot cancel used ticket');
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: TicketStatus.CANCELLED },
    });
  }
}
