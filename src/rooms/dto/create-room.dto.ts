import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Room number is required' })
  roomNumber: string;

  @IsString()
  @IsIn(['family', 'double', 'queen', 'apartment'], {
    message: 'Type must be family, double, queen, or apartment',
  })
  type: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Base price per night must be a number with up to 2 decimal places',
    },
  )
  @IsPositive({ message: 'Base price per night must be a positive number' })
  basePricePerNight: number;

  @IsString()
  @IsOptional()
  @IsIn(['available', 'maintenance', 'occupied', 'booked'], {
    message: 'Status must be available, maintenance, occupied, or booked',
  })
  status?: string;
}
