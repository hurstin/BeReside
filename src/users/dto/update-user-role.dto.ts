import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'staff', enum: ['admin', 'staff', 'guest'] })
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['admin', 'staff', 'guest'], {
    message: 'Role must be admin, staff, or guest',
  })
  role: string;
}
