import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'check_in_date', type: 'date' })
  checkInDate: string;

  @Column({ name: 'check_out_date', type: 'date' })
  checkOutDate: string;

  @Column({ name: 'total_price', type: 'numeric', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  paymentStatus: string;

  @Column({
    name: 'booking_status',
    type: 'varchar',
    length: 20,
    default: 'confirmed',
  })
  bookingStatus: string;

  @Column({ name: 'stripe_payment_intent_id', type: 'varchar', nullable: true })
  stripePaymentIntentId: string | null;

  @Column({
    name: 'refunded_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  refundedAmount: number;

  @Column({ name: 'check_in_pin', type: 'varchar', length: 10, nullable: true })
  checkInPin: string | null;

  @Column({ name: 'checked_in_by_id', type: 'uuid', nullable: true })
  checkedInById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'checked_in_by_id' })
  checkedInBy: User | null;

  @Column({
    name: 'actual_check_in_time',
    type: 'timestamp with time zone',
    nullable: true,
  })
  actualCheckInTime: Date | null;

  @Column({
    name: 'actual_check_out_time',
    type: 'timestamp with time zone',
    nullable: true,
  })
  actualCheckOutTime: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ name: 'is_no_show', type: 'boolean', default: false })
  isNoShow: boolean;
}
