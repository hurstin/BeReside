import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'], {
    message:
      'Status must be pending, confirmed, checked-in, completed, or cancelled',
  })
  status: string;
}
