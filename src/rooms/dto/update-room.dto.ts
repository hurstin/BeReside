import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Room number cannot be empty' })
  @IsOptional()
  roomNumber?: string;

  @IsString()
  @IsIn(['family', 'double', 'queen', 'apartment'], {
    message: 'Type must be family, double, queen, or apartment',
  })
  @IsOptional()
  type?: string;

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

  @IsString()
  @IsOptional()
  @IsIn(['available', 'maintenance', 'occupied', 'booked'], {
    message: 'Status must be available, maintenance, occupied, or booked',
  })
  status?: string;
}
