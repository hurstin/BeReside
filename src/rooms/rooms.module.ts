import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsSeederService } from './rooms-seeder.service';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), BookingsModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsSeederService],
  exports: [TypeOrmModule, RoomsService],
})
export class RoomsModule {}
