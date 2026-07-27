/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { CreateWalkInBookingDto } from './dto/create-walkin-booking.dto';
import { User } from '../users/user.entity';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Stripe from 'stripe';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: any,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
        statuses: ['confirmed', 'pending', 'checked-in'],
      })
      .andWhere('booking.check_in_date < :checkOutDate', { checkOutDate })
      .andWhere('booking.check_out_date > :checkInDate', { checkInDate })
      .getCount();

    if (overlappingBookings > 0) {
      throw new ConflictException(
        'Room is not available for the selected dates',
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (nights <= 0) {
      throw new ConflictException('Check-out date must be after check-in date');
    }

    // Calculate total cost with weekend surcharge
    const basePrice = Number(room.basePricePerNight);
    let totalPrice = 0;

    for (let i = 0; i < nights; i++) {
      const currentDay = new Date(checkIn.getTime() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = currentDay.getDay();

      // Friday (5) or Saturday (6) gets a 15% surcharge
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        totalPrice += basePrice * 1.15;
      } else {
        totalPrice += basePrice;
      }
    }

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

  async createPublicBooking(
    createPublicBookingDto: CreatePublicBookingDto,
  ): Promise<{ booking: Booking; url: string | null }> {
    const {
      guestEmail,
      guestFirstName,
      guestLastName,
      guestPhone,
      ...bookingData
    } = createPublicBookingDto;

    // Find or create guest user
    let user = await this.userRepository.findOne({
      where: { email: guestEmail.toLowerCase() },
    });
    if (!user) {
      user = this.userRepository.create({
        email: guestEmail.toLowerCase(),
        firstName: guestFirstName,
        lastName: guestLastName,
        phoneNumber: guestPhone,
        role: 'guest',
        passwordHash: Math.random().toString(36).slice(-10) + 'A1!', // random hash since they don't login
      });
      user = await this.userRepository.save(user);
    }

    // Reuse the internal booking logic
    return this.createBooking(user.id, bookingData);
  }

  async createWalkInBooking(
    staffId: string,
    createWalkInDto: CreateWalkInBookingDto,
  ): Promise<Booking> {
    const {
      guestEmail,
      guestFirstName,
      guestLastName,
      guestPhone,
      roomId,
      checkInDate,
      checkOutDate,
    } = createWalkInDto;

    // 1. Verify Room Availability & Price (similar to createBooking but extracted here to bypass Stripe)
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const overlappingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId })
      .andWhere('booking.booking_status IN (:...statuses)', {
        statuses: ['confirmed', 'pending', 'checked-in'],
      })
      .andWhere('booking.check_in_date < :checkOutDate', { checkOutDate })
      .andWhere('booking.check_out_date > :checkInDate', { checkInDate })
      .getCount();

    if (overlappingBookings > 0) {
      throw new ConflictException(
        'Room is not available for the selected dates',
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (nights <= 0) {
      throw new ConflictException('Check-out date must be after check-in date');
    }

    // Calculate total cost with weekend surcharge
    const basePrice = Number(room.basePricePerNight);
    let totalPrice = 0;
    for (let i = 0; i < nights; i++) {
      const currentDay = new Date(checkIn.getTime() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = currentDay.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        totalPrice += basePrice * 1.15;
      } else {
        totalPrice += basePrice;
      }
    }

    // 2. Find or Create Guest User
    let user = await this.userRepository.findOne({
      where: { email: guestEmail.toLowerCase() },
    });
    if (!user) {
      user = this.userRepository.create({
        email: guestEmail.toLowerCase(),
        firstName: guestFirstName,
        lastName: guestLastName,
        phoneNumber: guestPhone,
        role: 'guest',
        passwordHash: Math.random().toString(36).slice(-10) + 'A1!',
      });
      user = await this.userRepository.save(user);
    }

    // Check if check-in date is today or in the past (to immediately check them in)
    // We use local date string comparison since UI sends YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    const isTodayOrPast = checkInDate <= todayStr;

    // 3. Create the Booking as Paid & conditionally Checked-in
    const booking = this.bookingRepository.create({
      userId: user.id,
      roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
      paymentStatus: 'paid',
      bookingStatus: isTodayOrPast ? 'checked-in' : 'confirmed',
      checkedInById: isTodayOrPast ? staffId : undefined,
      actualCheckInTime: isTodayOrPast ? new Date() : undefined,
    });

    // Generate Check-In PIN ONLY if they are NOT checking in right now
    if (!isTodayOrPast) {
      booking.checkInPin = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
    }

    const savedBooking = await this.bookingRepository.save(booking);

    if (isTodayOrPast) {
      // Update Room Status only if checking in right now
      await this.roomRepository.update(room.id, { status: 'occupied' });
    }

    // Ensure relations are loaded for email sending
    const loadedBooking = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: { user: true, room: true },
    });

    if (loadedBooking) {
      // Send receipt email
      await this.mailService.sendPaymentReceipt(
        loadedBooking.user.email,
        loadedBooking,
      );
    }

    return savedBooking;
  }

  async requestMagicLink(
    email: string,
  ): Promise<{ token: string; message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      // Do not reveal if email exists or not to prevent user enumeration
      return {
        message:
          'If a booking exists for this email, a magic link has been sent.',
        token: '', // Return empty in prod
      };
    }

    const payload = { sub: user.id, email: user.email, purpose: 'magic-link' };
    const token = this.jwtService.sign(payload, { expiresIn: '15m' });

    await this.mailService.sendMagicLink(user.email, token);

    return {
      message:
        'If a booking exists for this email, a magic link has been sent.',
      token: '', // Returning empty token in response for security
    };
  }

  async getBookingsByMagicLink(token: string): Promise<Booking[]> {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.purpose !== 'magic-link') {
        throw new ForbiddenException('Invalid token purpose');
      }

      return this.getUserBookings(decoded.sub);
    } catch (err) {
      throw new ForbiddenException('Invalid or expired magic link');
    }
  }

  async cancelBookingByMagicLink(
    token: string,
    bookingId: string,
  ): Promise<Booking> {
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.purpose !== 'magic-link') {
        throw new ForbiddenException('Invalid token purpose');
      }

      const booking = await this.findById(bookingId);
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.userId !== decoded.sub) {
        throw new ForbiddenException(
          'You do not have permission to cancel this booking',
        );
      }

      return this.processCancellation(booking);
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException ||
        err instanceof ForbiddenException
      ) {
        throw err;
      }
      throw new ForbiddenException('Invalid or expired magic link');
    }
  }

  async updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: string,
    bookingStatus: string,
    stripePaymentIntentId?: string,
  ): Promise<void> {
    const updateData: Partial<Booking> = {
      paymentStatus,
      bookingStatus,
    };
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    if (paymentStatus === 'paid') {
      updateData.checkInPin = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
    }
    await this.bookingRepository.update(bookingId, updateData);
  }

  async verifyCheckIn(
    referenceId: string,
    pin: string,
  ): Promise<{ booking: Booking; isTooEarly: boolean; message?: string }> {
    const bookings = await this.bookingRepository.find({
      relations: { user: true, room: true },
    });

    const booking = bookings.find(
      (b) => b.id.startsWith(referenceId) && b.checkInPin === pin,
    );

    if (!booking) {
      throw new NotFoundException('Invalid Reference ID or PIN');
    }

    if (booking.bookingStatus === 'cancelled') {
      throw new BadRequestException('This booking has been cancelled');
    }

    if (booking.bookingStatus === 'checked-in') {
      throw new BadRequestException('This guest has already checked in');
    }

    let isTooEarly = false;
    let message: string | undefined;

    const dateParts = String(booking.checkInDate).split('-');
    if (dateParts.length === 3) {
      const checkInTime = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2]),
        14,
        0,
        0,
        0,
      );
      if (new Date() < checkInTime) {
        isTooEarly = true;
        message =
          'It is too early to check in. Check-in is available starting at 2:00 PM on the arrival date.';
      }
    }

    return { booking, isTooEarly, message };
  }

  private mapVirtualRoomStatus(booking: Booking): Booking {
    if (booking && booking.room && booking.bookingStatus === 'confirmed') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (booking.checkInDate <= todayStr && booking.checkOutDate > todayStr) {
        booking.room.status = 'booked';
      }
    }
    return booking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      where: { userId },
      relations: { room: true },
      order: {
        createdAt: 'DESC',
      },
    });
    return bookings.map((b) => this.mapVirtualRoomStatus(b));
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      relations: { user: true, room: true, checkedInBy: true },
      order: { createdAt: 'DESC' },
    });
    return bookings.map((b) => this.mapVirtualRoomStatus(b));
  }

  async findById(id: string): Promise<Booking | null> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: true, room: true, checkedInBy: true },
    });
    return booking ? this.mapVirtualRoomStatus(booking) : null;
  }

  async updateStatus(
    id: string,
    status: string,
    staffId?: string,
  ): Promise<Booking> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const updateData: Partial<Booking> = { bookingStatus: status };
    if (status === 'checked-in') {
      updateData.actualCheckInTime = new Date();
      if (staffId) updateData.checkedInById = staffId;
    } else if (status === 'completed') {
      updateData.actualCheckOutTime = new Date();
    }

    await this.bookingRepository.update(id, updateData);

    // Handle room status based on booking status change
    if (status === 'checked-in') {
      await this.roomRepository.update(booking.roomId, { status: 'occupied' });
    } else if (status === 'completed' || status === 'cancelled') {
      await this.roomRepository.update(booking.roomId, { status: 'available' });
    }

    const updatedBooking = (await this.findById(id)) as Booking;
    if (status === 'cancelled' && updatedBooking && updatedBooking.user) {
      await this.mailService.sendCancellationNotice(
        updatedBooking.user.email,
        updatedBooking,
      );
    } else if (
      status === 'completed' &&
      updatedBooking &&
      updatedBooking.user
    ) {
      await this.mailService.sendCheckOutReceipt(
        updatedBooking.user.email,
        updatedBooking,
      );
    }

    return updatedBooking;
  }

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to cancel this booking',
      );
    }

    return this.processCancellation(booking);
  }

  private async processCancellation(booking: Booking): Promise<Booking> {
    const checkInMidnight = new Date(booking.checkInDate);
    checkInMidnight.setHours(0, 0, 0, 0);

    const now = new Date();
    const hoursUntilCheckIn =
      (checkInMidnight.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundAmount = Number(booking.totalPrice);
    if (hoursUntilCheckIn < 48) {
      // 50% flat fee penalty
      refundAmount = refundAmount * 0.5;
    }

    if (
      booking.paymentStatus === 'paid' &&
      booking.stripePaymentIntentId &&
      refundAmount > 0
    ) {
      try {
        await this.stripe.refunds.create({
          payment_intent: booking.stripePaymentIntentId,
          amount: Math.round(refundAmount * 100),
        });
        booking.refundedAmount = refundAmount;
        booking.paymentStatus =
          refundAmount < Number(booking.totalPrice)
            ? 'partially_refunded'
            : 'refunded';
      } catch (err) {
        console.error('Failed to issue Stripe refund:', err);
      }
    }

    await this.bookingRepository.update(booking.id, {
      bookingStatus: 'cancelled',
      refundedAmount: booking.refundedAmount || 0,
      paymentStatus: booking.paymentStatus,
    });

    const cancelledBooking = (await this.findById(booking.id)) as Booking;
    if (cancelledBooking && cancelledBooking.user) {
      await this.mailService.sendCancellationNotice(
        cancelledBooking.user.email,
        cancelledBooking,
      );
    }

    return cancelledBooking;
  }
}
