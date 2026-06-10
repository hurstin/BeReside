import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty({ example: '101', required: false })
  @IsString()
  @IsNotEmpty({ message: 'Room number cannot be empty' })
  @IsOptional()
  roomNumber?: string;

  @ApiProperty({
    example: 'double',
    enum: ['family', 'double', 'queen', 'apartment'],
    required: false,
  })
  @IsString()
  @IsIn(['family', 'double', 'queen', 'apartment'], {
    message: 'Type must be family, double, queen, or apartment',
  })
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 150.0, required: false })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Base price per night must be a number with up to 2 decimal places',
    },
  )
  @IsPositive({ message: 'Base price per night must be a positive number' })
  @IsOptional()
  basePricePerNight?: number;

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
