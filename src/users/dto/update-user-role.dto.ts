import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  @IsIn(['admin', 'staff', 'guest'], {
    message: 'Role must be admin, staff, or guest',
  })
  role: string;
}
