import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateWalkInBookingDto {
  @ApiProperty({ description: 'The ID of the room to book' })
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'The check-in date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @ApiProperty({ description: 'The check-out date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;

  @ApiProperty({ description: 'Guest first name' })
  @IsString()
  @IsNotEmpty()
  guestFirstName: string;

  @ApiProperty({ description: 'Guest last name' })
  @IsString()
  @IsNotEmpty()
  guestLastName: string;

  @ApiProperty({ description: 'Guest email address' })
  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;

  @ApiProperty({ description: 'Guest phone number' })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;
}
