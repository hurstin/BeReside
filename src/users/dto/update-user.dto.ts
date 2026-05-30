import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @IsIn(['guest', 'admin', 'staff'], {
    message: 'Role must be either guest, admin, or staff',
  })
  role?: string;
}
