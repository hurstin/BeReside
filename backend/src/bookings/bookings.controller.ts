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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateWalkInBookingDto } from './dto/create-walkin-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Booking } from './booking.entity';

export interface AuthenticatedRequest {
  user?: {
    sub?: string;
    id?: string;
  };
}

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new booking',
    description:
      'Allows an authenticated user to book a room. Returns the booking details and a Stripe checkout URL for payment.',
  })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ booking: Booking; url: string | null }> {
    const userId = String(req.user?.sub || req.user?.id); // sub is from JWT payload
    return this.bookingsService.createBooking(userId, createBookingDto);
  }

  @Post('walk-in')
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Create a walk-in booking',
    description:
      'Allows admin/staff to directly book a room for a walk-in guest without Stripe checkout. Assumes physical payment.',
  })
  async createWalkIn(
    @Request() req: AuthenticatedRequest,
    @Body() createWalkInBookingDto: CreateWalkInBookingDto,
  ): Promise<Booking> {
    const staffId = String(req.user?.sub || req.user?.id);
    return this.bookingsService.createWalkInBooking(
      staffId,
      createWalkInBookingDto,
    );
  }

  @Get('my-reservations')
  @ApiOperation({
    summary: 'Get my reservations',
    description:
      'Retrieves all bookings made by the currently authenticated user.',
  })
  async getMyReservations(
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking[]> {
    const userId = String(req.user?.sub || req.user?.id);
    return this.bookingsService.getUserBookings(userId);
  }

  @Post('verify-checkin')
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Verify check-in PIN',
    description:
      'Verifies a check-in PIN and Reference ID. Returns the booking if valid.',
  })
  async verifyCheckIn(
    @Body() body: { referenceId: string; pin: string },
  ): Promise<{ booking: Booking; isTooEarly: boolean; message?: string }> {
    return this.bookingsService.verifyCheckIn(body.referenceId, body.pin);
  }

  @Get()
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Get all bookings',
    description:
      'Retrieves a list of all bookings in the system. Requires Admin or Staff privileges.',
  })
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Get booking by ID',
    description:
      'Retrieves the details of a specific booking by its UUID. Requires Admin or Staff privileges.',
  })
  async findOne(@Param('id') id: string): Promise<Booking | null> {
    return this.bookingsService.findById(id);
  }

  @Patch(':id/status')
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Update booking status',
    description:
      'Allows Admin or Staff to update the status of a booking (e.g., pending, confirmed, checked-in, completed).',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    const staffId = String(req.user?.sub || req.user?.id);
    return this.bookingsService.updateStatus(
      id,
      updateBookingStatusDto.status,
      staffId,
    );
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel a booking',
    description:
      'Allows a user to cancel their own booking. If the check-in date is less than 48 hours away, cancellation is denied.',
  })
  async cancelBooking(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Booking> {
    const userId = String(req.user?.sub || req.user?.id);
    return this.bookingsService.cancelBooking(id, userId);
  }
}
