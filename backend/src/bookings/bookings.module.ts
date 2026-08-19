import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { IdempotencyKey } from '../common/entities/idempotency-key.entity';
import { BookingsController } from './bookings.controller';
import { PublicBookingsController } from './public-bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsTasksService } from './bookings-tasks.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Room, User, IdempotencyKey]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_development_secret',
      signOptions: { expiresIn: '15m' },
    }),
    MailModule,
  ],
  controllers: [BookingsController, PublicBookingsController],
  providers: [BookingsService, BookingsTasksService],
  exports: [TypeOrmModule, BookingsService],
})
export class BookingsModule {}
