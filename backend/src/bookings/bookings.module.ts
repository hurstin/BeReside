import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsTasksService } from './bookings-tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room, User])],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsTasksService],
  exports: [TypeOrmModule, BookingsService],
})
export class BookingsModule {}
