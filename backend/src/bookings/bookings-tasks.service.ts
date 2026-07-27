import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';

@Injectable()
export class BookingsTasksService {
  private readonly logger = new Logger(BookingsTasksService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Running scheduled booking & room status jobs...');
    await this.cancelExpiredBookings();
    await this.cancelNoShowBookings();
    await this.updateRoomStatuses();
  }

  private async cancelExpiredBookings() {
    // 10 minutes ago
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const expiredBookings = await this.bookingRepository.find({
      where: {
        bookingStatus: 'pending',
        createdAt: LessThan(tenMinutesAgo),
      },
    });

    if (expiredBookings.length > 0) {
      this.logger.log(
        `Found ${expiredBookings.length} expired pending bookings. Cancelling them...`,
      );
      for (const booking of expiredBookings) {
        booking.bookingStatus = 'cancelled';
        booking.paymentStatus = 'failed';
        await this.bookingRepository.save(booking);
        this.logger.log(
          `Booking ${booking.id} cancelled due to payment timeout.`,
        );
      }
    }
  }

  private async cancelNoShowBookings() {
    const todayStr = new Date().toISOString().split('T')[0];

    const noShowBookings = await this.bookingRepository.find({
      where: {
        bookingStatus: 'confirmed',
        checkOutDate: LessThan(todayStr),
      },
    });

    if (noShowBookings.length > 0) {
      this.logger.log(
        `Found ${noShowBookings.length} no-show bookings. Cancelling them...`,
      );
      for (const booking of noShowBookings) {
        booking.bookingStatus = 'cancelled';
        booking.isNoShow = true;
        await this.bookingRepository.save(booking);
        this.logger.log(`Booking ${booking.id} cancelled as no-show.`);
      }
    }
  }

  private async updateRoomStatuses() {
    const todayStr = new Date().toISOString().split('T')[0];

    // Find all rooms
    const rooms = await this.roomRepository.find();

    for (const room of rooms) {
      // Find if there is an active confirmed booking for this room today
      // (check_in_date <= today AND check_out_date > today)
      const activeBookingCount = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.room_id = :roomId', { roomId: room.id })
        .andWhere('booking.booking_status = :status', { status: 'confirmed' })
        .andWhere('booking.check_in_date <= :today', { today: todayStr })
        .andWhere('booking.check_out_date > :today', { today: todayStr })
        .getCount();

      if (activeBookingCount > 0) {
        // There is an active booking today. Change status to 'booked' if currently 'available'
        if (room.status === 'available') {
          room.status = 'booked';
          await this.roomRepository.save(room);
          this.logger.log(
            `Room ${room.roomNumber} status changed to 'booked' (occupied today).`,
          );
        }
      } else {
        // No active booking today. Revert to 'available' if it was 'booked' or 'occupied'
        if (room.status === 'booked' || room.status === 'occupied') {
          room.status = 'available';
          await this.roomRepository.save(room);
          this.logger.log(
            `Room ${room.roomNumber} status reverted to 'available' (no active booking today).`,
          );
        }
      }
    }
  }
}
