import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  Param,
  UseGuards,
  Post,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieves the profile information for the currently authenticated user based on the provided JWT token.',
  })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user profile',
    description:
      'Allows the authenticated user to update their profile information. Note: Roles and passwords cannot be updated through this endpoint.',
  })
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
  @ApiOperation({
    summary: 'Update current user password',
    description:
      'Allows the authenticated user to securely update their password by providing their current password and a new password.',
  })
  async updatePassword(
    @Request() req: { user: { id: string } },
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(req.user.id, updatePasswordDto);
    return { message: 'Password updated successfully' };
  }

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieves a list of all users registered in the system. Requires Admin privileges.',
  })
  async findAll(
    @Query('role') role?: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    const withDeleted = includeDeleted === 'true';
    return this.usersService.findAll(role, withDeleted);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Allows an administrator to create a new user with a specific role.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const passwordHash = await bcrypt.hash(
      password || 'defaultPassword123!',
      10,
    );
    return this.usersService.create({
      ...rest,
      passwordHash,
    });
  }

  @Get(':id')
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieves the profile of a specific user by their UUID. Requires Admin or Staff privileges.',
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @Roles('admin')
  @ApiOperation({
    summary: 'Update user role',
    description:
      'Allows an administrator to change the access role (guest, staff, admin) of a specific user.',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.update(id, { role: updateUserRoleDto.role });
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Permanently removes a user from the system based on their UUID. Requires Admin privileges.',
  })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User successfully removed' };
  }

  @Patch(':id/restore')
  @Roles('admin')
  @ApiOperation({
    summary: 'Restore a deleted user',
    description:
      'Restores a soft-deleted user (e.g., granting access back to a revoked staff member). Requires Admin privileges.',
  })
  async restore(@Param('id') id: string) {
    await this.usersService.restore(id);
    return { message: 'User successfully restored' };
  }
}
