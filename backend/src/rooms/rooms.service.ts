import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(
    checkIn?: string,
    checkOut?: string,
    status?: string,
  ): Promise<Room[]> {
    const query = this.roomRepository.createQueryBuilder('room');

    if (checkIn && checkOut) {
      if (!status) {
        query.andWhere('room.status = :defaultStatus', {
          defaultStatus: 'available',
        });
      } else {
        query.andWhere('room.status = :status', { status });
      }

      query.andWhere(
        `NOT EXISTS (
          SELECT 1 FROM bookings b 
          WHERE b.room_id = room.id 
          AND b.booking_status = 'confirmed'
          AND b.check_in_date < :checkOut 
          AND b.check_out_date > :checkIn
        )`,
        { checkIn, checkOut },
      );
    } else {
      if (status) {
        query.andWhere('room.status = :status', { status });
      }
    }

    query.orderBy('room.room_number', 'ASC');
    const rooms = await query.getMany();

    const todayStr = new Date().toISOString().split('T')[0];
    const processedRooms: Room[] = [];

    for (const room of rooms) {
      const activeBooking = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .where('booking.room_id = :roomId', { roomId: room.id })
        .andWhere('booking.booking_status IN (:...statuses)', {
          statuses: ['confirmed', 'checked-in', 'pending'],
        })
        .andWhere('booking.check_in_date <= :today', { today: todayStr })
        .andWhere('booking.check_out_date > :today', { today: todayStr })
        .getOne();

      if (activeBooking) {
        if (activeBooking.bookingStatus === 'checked-in') {
          room.status = 'occupied';
        } else {
          room.status = 'booked';
        }
        Object.assign(room, { currentBooking: activeBooking });
      } else {
        if (room.status === 'booked' || room.status === 'occupied') {
          room.status = 'available';
        }
      }

      const upcomingBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.user', 'user')
        .where('booking.room_id = :roomId', { roomId: room.id })
        .andWhere('booking.booking_status IN (:...statuses)', {
          statuses: ['confirmed', 'checked-in', 'pending'],
        })
        .andWhere('booking.check_in_date > :today', { today: todayStr })
        .select(['booking.checkInDate', 'booking.checkOutDate'])
        .orderBy('booking.checkInDate', 'ASC')
        .getMany();

      if (upcomingBookings.length > 0) {
        room.upcomingBookings = upcomingBookings.map((b) => ({
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
        }));
      }

      // Filter based on resolved status if status query parameter was provided
      if (status === 'available' && room.status !== 'available') {
        continue;
      }
      if (
        (status === 'booked' || status === 'occupied') &&
        room.status !== 'booked' &&
        room.status !== 'occupied'
      ) {
        continue;
      }

      processedRooms.push(room);
    }

    return processedRooms;
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const activeBookingCount = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId: room.id })
      .andWhere('booking.booking_status = :status', { status: 'confirmed' })
      .andWhere('booking.check_in_date <= :today', { today: todayStr })
      .andWhere('booking.check_out_date > :today', { today: todayStr })
      .getCount();

    if (activeBookingCount > 0) {
      if (room.status === 'available') {
        room.status = 'booked';
      }
    } else {
      if (room.status === 'booked' || room.status === 'occupied') {
        room.status = 'available';
      }
    }

    const upcomingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId: room.id })
      .andWhere('booking.booking_status = :status', { status: 'confirmed' })
      .andWhere('booking.check_in_date > :today', { today: todayStr })
      .select(['booking.checkInDate', 'booking.checkOutDate'])
      .orderBy('booking.checkInDate', 'ASC')
      .getMany();

    if (upcomingBookings.length > 0) {
      room.upcomingBookings = upcomingBookings.map((b) => ({
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
      }));
    }

    return room;
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existing = await this.roomRepository.findOne({
      where: { roomNumber: createRoomDto.roomNumber },
    });
    if (existing) {
      throw new ConflictException(
        `Room number ${createRoomDto.roomNumber} already exists`,
      );
    }
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    if (
      updateRoomDto.roomNumber &&
      updateRoomDto.roomNumber !== room.roomNumber
    ) {
      const existing = await this.roomRepository.findOne({
        where: { roomNumber: updateRoomDto.roomNumber },
      });
      if (existing) {
        throw new ConflictException(
          `Room number ${updateRoomDto.roomNumber} already exists`,
        );
      }
    }

    if (updateRoomDto.type && updateRoomDto.type !== room.type) {
      const today = new Date().toISOString().split('T')[0];
      const activeBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.room_id = :id', { id })
        .andWhere('booking.booking_status = :status', { status: 'confirmed' })
        .andWhere('booking.check_out_date >= :today', { today })
        .getCount();

      if (activeBookings > 0) {
        throw new BadRequestException(
          'Cannot change room type because there are upcoming confirmed bookings for this room.',
        );
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
    const activeBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :id', { id })
      .andWhere('booking.booking_status = :status', { status: 'confirmed' })
      .andWhere('booking.check_out_date >= :today', { today })
      .getCount();

    if (activeBookings > 0) {
      throw new BadRequestException(
        'Cannot delete room because there are upcoming confirmed bookings.',
      );
    }

    await this.roomRepository.softDelete(id);
  }
}
