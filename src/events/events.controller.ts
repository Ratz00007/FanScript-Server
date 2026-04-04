import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, EventFilterDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events with filters' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() filters: EventFilterDto) {
    return this.eventsService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured events' })
  getFeatured() {
    return this.eventsService.getFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get event by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event (venue only)' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto, 'current-user-id'); // Will get from request
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto, 'current-user-id');
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish event' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.publish(id, 'current-user-id');
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel event' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.cancel(id, 'current-user-id');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.delete(id, 'current-user-id');
  }
}
