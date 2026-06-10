import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: '101' })
  @IsString()
  @IsNotEmpty({ message: 'Room number is required' })
  roomNumber: string;

  @ApiProperty({
    example: 'double',
    enum: ['family', 'double', 'queen', 'apartment'],
  })
  @IsString()
  @IsIn(['family', 'double', 'queen', 'apartment'], {
    message: 'Type must be family, double, queen, or apartment',
  })
  type: string;

  @ApiProperty({ example: 150.0 })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Base price per night must be a number with up to 2 decimal places',
    },
  )
  @IsPositive({ message: 'Base price per night must be a positive number' })
  basePricePerNight: number;

  @ApiProperty({
    example: 'available',
    enum: ['available', 'maintenance', 'occupied', 'booked'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['available', 'maintenance', 'occupied', 'booked'], {
    message: 'Status must be available, maintenance, occupied, or booked',
  })
  status?: string;
}
