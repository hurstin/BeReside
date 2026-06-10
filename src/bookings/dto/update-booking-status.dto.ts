import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
  @ApiProperty({
    example: 'checked-in',
    enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'], {
    message:
      'Status must be pending, confirmed, checked-in, completed, or cancelled',
  })
  status: string;
}
