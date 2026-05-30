import {
  IsUUID,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID('all', { message: 'User ID must be a valid UUID' })
  userId: string;

  @IsUUID('all', { message: 'Room ID must be a valid UUID' })
  roomId: string;

  @IsDateString(
    {},
    { message: 'Check-in date must be a valid ISO-8601 date string' },
  )
  checkInDate: string;

  @IsDateString(
    {},
    { message: 'Check-out date must be a valid ISO-8601 date string' },
  )
  checkOutDate: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Total price must be a number with up to 2 decimal places' },
  )
  @Min(0, { message: 'Total price must be zero or a positive amount' })
  totalPrice: number;

  @IsOptional()
  @IsIn(['pending', 'paid', 'failed', 'refunded'], {
    message: 'Payment status must be pending, paid, failed, or refunded',
  })
  paymentStatus?: string;

  @IsOptional()
  @IsIn(['confirmed', 'cancelled', 'completed'], {
    message: 'Booking status must be confirmed, cancelled, or completed',
  })
  bookingStatus?: string;
}
