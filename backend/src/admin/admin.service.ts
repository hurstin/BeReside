import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';
import { Room } from '../rooms/room.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async getDashboardStats() {
    // Total Users
    const totalUsers = await this.userRepository.count();

    // Total Rooms and Occupied Rooms
    const totalRooms = await this.roomRepository.count();
    const occupiedRooms = await this.roomRepository.count({
      where: { status: 'occupied' },
    });
    const occupancyRate =
      totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);

    // Total Revenue (only paid bookings)
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalPrice)', 'totalRevenue')
      .where('booking.paymentStatus = :status', { status: 'paid' })
      .getRawOne<{ totalRevenue: string }>();

    const totalRevenue = result?.totalRevenue
      ? parseFloat(result.totalRevenue)
      : 0;

    // Booking Counts
    const pendingBookings = await this.bookingRepository.count({
      where: { bookingStatus: 'pending' },
    });
    const confirmedBookings = await this.bookingRepository.count({
      where: { bookingStatus: 'confirmed' },
    });

    return {
      totalUsers,
      totalRooms,
      occupiedRooms,
      occupancyRate,
      totalRevenue,
      pendingBookings,
      confirmedBookings,
    };
  }
}
