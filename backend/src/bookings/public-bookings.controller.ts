import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { Booking } from './booking.entity';
import { Public } from '../common/decorators/public.decorator';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@ApiTags('Public Bookings')
@Controller('public/bookings')
export class PublicBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @UseInterceptors(IdempotencyInterceptor)
  @Post()
  @ApiOperation({
    summary: 'Create a new public booking',
    description:
      'Allows a guest to book a room without an account. Automatically ties the booking to their email.',
  })
  async create(
    @Body() createPublicBookingDto: CreatePublicBookingDto,
  ): Promise<{ booking: Booking; url: string | null }> {
    return this.bookingsService.createPublicBooking(createPublicBookingDto);
  }

  @Public()
  @Post('magic-link')
  @ApiOperation({
    summary: 'Request a magic link for a booking',
    description:
      'Generates a magic link token for a user to access their booking details without logging in.',
  })
  async requestMagicLink(@Body() body: { email: string }) {
    return this.bookingsService.requestMagicLink(body.email);
  }

  @Public()
  @Get('magic-link')
  @ApiOperation({
    summary: 'Get booking details using a magic link',
    description: 'Retrieves booking details using a valid magic link token.',
  })
  async getBookingByMagicLink(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token is required');
    return this.bookingsService.getBookingsByMagicLink(token);
  }

  @Public()
  @Post('magic-link/cancel')
  @ApiOperation({
    summary: 'Cancel a booking using a magic link',
    description: 'Cancels a booking using a valid magic link token.',
  })
  async cancelBookingByMagicLink(
    @Body() body: { token: string; bookingId: string },
  ) {
    if (!body.token || !body.bookingId)
      throw new BadRequestException('Token and Booking ID are required');
    return this.bookingsService.cancelBookingByMagicLink(
      body.token,
      body.bookingId,
    );
  }
}
