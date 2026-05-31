import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Booking } from '../bookings/booking.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async findAll(checkIn?: string, checkOut?: string, status?: string): Promise<Room[]> {
    const query = this.roomRepository.createQueryBuilder('room');

    if (status) {
      query.andWhere('room.status = :status', { status });
    }

    if (checkIn && checkOut) {
      if (!status) {
        query.andWhere('room.status = :defaultStatus', { defaultStatus: 'available' });
      }
      query.andWhere(
        `NOT EXISTS (
          SELECT 1 FROM bookings b 
          WHERE b.room_id = room.id 
          AND b.booking_status = 'confirmed'
          AND b.check_in_date < :checkOut 
          AND b.check_out_date > :checkIn
        )`,
        { checkIn, checkOut }
      );
    }

    query.orderBy('room.room_number', 'ASC');

    return query.getMany();
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existing = await this.roomRepository.findOne({ where: { roomNumber: createRoomDto.roomNumber } });
    if (existing) {
      throw new ConflictException(`Room number ${createRoomDto.roomNumber} already exists`);
    }
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.roomNumber) {
      const existing = await this.roomRepository.findOne({ where: { roomNumber: updateRoomDto.roomNumber } });
      if (existing) {
        throw new ConflictException(`Room number ${updateRoomDto.roomNumber} already exists`);
      }
    }

    if (updateRoomDto.type && updateRoomDto.type !== room.type) {
      const today = new Date().toISOString().split('T')[0];
      const activeBookings = await this.bookingRepository.createQueryBuilder('booking')
        .where('booking.room_id = :id', { id })
        .andWhere('booking.booking_status = :status', { status: 'confirmed' })
        .andWhere('booking.check_out_date >= :today', { today })
        .getCount();
      
      if (activeBookings > 0) {
        throw new BadRequestException('Cannot change room type because there are upcoming confirmed bookings for this room.');
      }
    }

    Object.assign(room, updateRoomDto);
    return this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const activeBookings = await this.bookingRepository.createQueryBuilder('booking')
      .where('booking.room_id = :id', { id })
      .andWhere('booking.booking_status = :status', { status: 'confirmed' })
      .andWhere('booking.check_out_date >= :today', { today })
      .getCount();
    
    if (activeBookings > 0) {
      throw new BadRequestException('Cannot delete room because there are upcoming confirmed bookings.');
    }

    await this.roomRepository.softDelete(id);
  }
}
