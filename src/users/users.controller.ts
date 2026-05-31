import { Controller, Get, Patch, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Prevent role and password escalation
    const safeUpdateData: Partial<UpdateUserDto> & Record<string, unknown> = {
      ...updateUserDto,
    };
    Reflect.deleteProperty(safeUpdateData, 'role');
    Reflect.deleteProperty(safeUpdateData, 'password');
    Reflect.deleteProperty(safeUpdateData, 'passwordHash');
    Reflect.deleteProperty(safeUpdateData, 'passwordConfirm');

    return this.usersService.update(req.user.id, safeUpdateData);
  }

  @Patch('me/password')
  async updatePassword(
    @Request() req: { user: { id: string } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(req.user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }
}
