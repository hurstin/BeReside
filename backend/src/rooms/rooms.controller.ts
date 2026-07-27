import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all rooms',
    description:
      'Retrieves a list of all rooms. Can be filtered by check-in date, check-out date, and availability status.',
  })
  async findAll(
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string,
    @Query('status') status?: string,
  ): Promise<Room[]> {
    return this.roomsService.findAll(checkIn, checkOut, status);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get room by ID',
    description:
      'Retrieves detailed information for a specific room based on its UUID, including its upcoming bookings and dynamic availability status.',
  })
  async findOne(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Create a new room',
    description: 'Adds a new room to the inventory. Requires Admin privileges.',
  })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(createRoomDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  @ApiOperation({
    summary: 'Update room details',
    description:
      'Allows Admin or Staff to update details of an existing room such as base price, type, or manual status override.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete a room',
    description:
      'Permanently deletes a room from the inventory. Requires Admin privileges.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.roomsService.remove(id);
  }
}
