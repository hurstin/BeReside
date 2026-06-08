import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get()
  @Roles('admin', 'staff')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'staff')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.update(id, { role: updateUserRoleDto.role });
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User successfully removed' };
  }
}
