import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'room_number', type: 'varchar', length: 10, unique: true })
  roomNumber: string;

  @Column({ name: 'type', type: 'varchar', length: 30 })
  type: string;

  @Column({
    name: 'base_price_per_night',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  basePricePerNight: number;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'available' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
