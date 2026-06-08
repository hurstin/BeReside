/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: any,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async createBooking(
    userId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<{ booking: Booking; url: string | null }> {
    const { roomId, checkInDate, checkOutDate } = createBookingDto;

    // Fetch the room
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Availability Check
    const overlappingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId })
      .andWhere('booking.booking_status IN (:...statuses)', {
        statuses: ['confirmed', 'pending'],
      })
      .andWhere('booking.check_in_date < :checkOutDate', { checkOutDate })
      .andWhere('booking.check_out_date > :checkInDate', { checkInDate })
      .getCount();

    if (overlappingBookings > 0) {
      throw new ConflictException(
        'Room is not available for the selected dates',
      );
    }

    // Calculate nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (nights <= 0) {
      throw new ConflictException('Check-out date must be after check-in date');
    }

    // Calculate total cost
    const basePrice = Number(room.basePricePerNight);
    const totalPrice = nights * basePrice;

    // Save State
    const booking = this.bookingRepository.create({
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Create Stripe Session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `BERESIDE - Room ${room.roomNumber}`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/booking/cancel`,
      metadata: { bookingId: savedBooking.id },
    });

    return { booking: savedBooking, url: session.url };
  }

  async updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: string,
    bookingStatus: string,
  ): Promise<void> {
    await this.bookingRepository.update(bookingId, {
      paymentStatus,
      bookingStatus,
    });

    if (bookingStatus === 'confirmed') {
      const booking = await this.bookingRepository.findOne({
        where: { id: bookingId },
        relations: { room: true },
      });
      if (booking && booking.room) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (
          booking.checkInDate <= todayStr &&
          booking.checkOutDate > todayStr
        ) {
          if (booking.room.status === 'available') {
            await this.roomRepository.update(booking.roomId, {
              status: 'booked',
            });
          }
        }
      }
    }
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: { room: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: { user: true, room: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: { user: true, room: true },
    });
  }

  async updateStatus(id: string, status: string): Promise<Booking> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.bookingRepository.update(id, { bookingStatus: status });

    // Handle room status based on booking status change
    if (status === 'checked-in') {
      await this.roomRepository.update(booking.roomId, { status: 'occupied' });
    } else if (status === 'completed' || status === 'cancelled') {
      await this.roomRepository.update(booking.roomId, { status: 'available' });
    }

    return (await this.findById(id)) as Booking;
  }
}
