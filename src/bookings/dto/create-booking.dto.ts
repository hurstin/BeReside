import { IsUUID, IsDateString } from 'class-validator';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';
import { IsAfterDate } from '../../common/validators/is-after-date.validator';

export class CreateBookingDto {
  @IsUUID('all', { message: 'Room ID must be a valid UUID' })
  roomId: string;

  @IsDateString(
    {},
    { message: 'Check-in date must be a valid ISO-8601 date string' },
  )
  @IsFutureDate()
  checkInDate: string;

  @IsDateString(
    {},
    { message: 'Check-out date must be a valid ISO-8601 date string' },
  )
  @IsAfterDate('checkInDate')
  checkOutDate: string;
}
