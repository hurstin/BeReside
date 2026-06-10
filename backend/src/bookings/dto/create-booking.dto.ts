import { IsUUID, IsDateString } from 'class-validator';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';
import { IsAfterDate } from '../../common/validators/is-after-date.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID('all', { message: 'Room ID must be a valid UUID' })
  roomId: string;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString(
    {},
    { message: 'Check-in date must be a valid ISO-8601 date string' },
  )
  @IsFutureDate()
  checkInDate: string;

  @ApiProperty({ example: '2026-06-20' })
  @IsDateString(
    {},
    { message: 'Check-out date must be a valid ISO-8601 date string' },
  )
  @IsAfterDate('checkInDate')
  checkOutDate: string;
}
