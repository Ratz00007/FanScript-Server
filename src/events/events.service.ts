import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateEventDto, UpdateEventDto, EventFilterDto } from './dto';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEventDto, userId: string) {
    // Get venue for this user
    const venue = await this.prisma.venue.findUnique({
      where: { userId },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found. Please create a venue first.');
    }

    const slug = this.generateSlug(data.title);

    return this.prisma.event.create({
      data: {
        ...data,
        slug,
        venueId: venue.id,
        status: EventStatus.DRAFT,
      },
      include: {
        venue: true,
        artist: true,
        ticketTiers: true,
      },
    });
  }

  async findAll(filters: EventFilterDto) {
    const { 
      page = 1, 
      limit = 20, 
      city, 
      country, 
      date, 
      search,
      status = EventStatus.PUBLISHED 
    } = filters;

    const where: any = { status };

    if (city) where.venue = { city };
    if (country) where.venue = { country };
    if (date) where.date = { gte: new Date(date) };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          venue: true,
          artist: true,
          ticketTiers: {
            where: { quantity: { gt: this.prisma.ticketTier.fields.sold } },
          },
        },
        orderBy: { date: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        artist: true,
        ticketTiers: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        venue: true,
        artist: true,
        ticketTiers: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findByVenue(venueId: string) {
    return this.prisma.event.findMany({
      where: { venueId },
      include: {
        artist: true,
        ticketTiers: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByArtist(artistId: string) {
    return this.prisma.event.findMany({
      where: { artistId },
      include: {
        venue: true,
        ticketTiers: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: string, data: UpdateEventDto, userId: string) {
    // Verify ownership
    const event = await this.findOne(id);
    const venue = await this.prisma.venue.findUnique({
      where: { userId },
    });

    if (event.venueId !== venue?.id) {
      throw new BadRequestException('You do not own this event');
    }

    return this.prisma.event.update({
      where: { id },
      data,
      include: {
        venue: true,
        artist: true,
        ticketTiers: true,
      },
    });
  }

  async publish(id: string, userId: string) {
    return this.update(id, { status: EventStatus.PUBLISHED }, userId);
  }

  async cancel(id: string, userId: string) {
    return this.update(id, { status: EventStatus.CANCELLED }, userId);
  }

  async delete(id: string, userId: string) {
    const event = await this.findOne(id);
    const venue = await this.prisma.venue.findUnique({
      where: { userId },
    });

    if (event.venueId !== venue?.id) {
      throw new BadRequestException('You do not own this event');
    }

    return this.prisma.event.delete({ where: { id } });
  }

  async getFeatured() {
    return this.prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        isFeatured: true,
        date: { gte: new Date() },
      },
      include: {
        venue: true,
        artist: true,
        ticketTiers: true,
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }

  private generateSlug(title: string): string {
    const timestamp = Date.now();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${timestamp}`;
  }
}
