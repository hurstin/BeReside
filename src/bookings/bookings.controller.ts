import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Booking } from './booking.entity';

interface AuthenticatedRequest {
  user?: {
    sub?: string;
    id?: string;
  };
}

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ booking: Booking; url: string | null }> {
    const userId = String(req.user?.sub || req.user?.id); // sub is from JWT payload
    return this.bookingsService.createBooking(userId, createBookingDto);
  }

  @Get('my-reservations')
  async getMyReservations(
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking[]> {
    const userId = String(req.user?.sub || req.user?.id);
    return this.bookingsService.getUserBookings(userId);
  }

  @Get()
  @Roles('admin', 'staff')
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'staff')
  async findOne(@Param('id') id: string): Promise<Booking | null> {
    return this.bookingsService.findById(id);
  }

  @Patch(':id/status')
  @Roles('admin', 'staff')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookingsService.updateStatus(id, updateBookingStatusDto.status);
  }
}
