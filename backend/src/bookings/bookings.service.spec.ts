/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
  };
  let roomRepository: {
    update: jest.Mock;
  };
  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let jwtService: {
    sign: jest.Mock;
    verify: jest.Mock;
  };
  let mailService: {
    sendPaymentReceipt: jest.Mock;
    sendMagicLink: jest.Mock;
    sendCancellationNotice: jest.Mock;
    sendCheckOutReceipt: jest.Mock;
  };
  let stripeClient: {
    checkout: { sessions: { create: jest.Mock } };
    refunds: { create: jest.Mock };
  };

  beforeEach(async () => {
    bookingRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    roomRepository = {
      update: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    mailService = {
      sendPaymentReceipt: jest.fn(),
      sendMagicLink: jest.fn(),
      sendCancellationNotice: jest.fn(),
      sendCheckOutReceipt: jest.fn(),
    };

    stripeClient = {
      checkout: {
        sessions: {
          create: jest.fn(),
        },
      },
      refunds: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepository,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: roomRepository,
        },
        {
          provide: 'STRIPE_CLIENT',
          useValue: stripeClient,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: MailService,
          useValue: mailService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all bookings with relations', async () => {
      const bookings = [{ id: '1' }] as Booking[];
      bookingRepository.find?.mockResolvedValue(bookings);

      const result = await service.findAll();
      expect(bookingRepository.find).toHaveBeenCalledWith({
        relations: { user: true, room: true, checkedInBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(bookings);
    });
  });

  describe('findById', () => {
    it('should return a single booking by id', async () => {
      const booking = { id: '1' } as Booking;
      bookingRepository.findOne?.mockResolvedValue(booking);

      const result = await service.findById('1');
      expect(bookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: { user: true, room: true, checkedInBy: true },
      });
      expect(result).toEqual(booking);
    });
  });

  describe('updateStatus', () => {
    it('should throw NotFoundException if booking is not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.updateStatus('1', 'checked-in')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update booking status and set room to occupied when checked-in', async () => {
      const booking = { id: '1', roomId: 'r1' } as Booking;
      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await service.updateStatus('1', 'checked-in');

      expect(bookingRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          bookingStatus: 'checked-in',
          actualCheckInTime: expect.any(Date),
        } as any),
      );
      expect(roomRepository.update).toHaveBeenCalledWith('r1', {
        status: 'occupied',
      });
    });

    it('should update booking status and set room to available when completed', async () => {
      const booking = { id: '1', roomId: 'r1' } as Booking;
      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await service.updateStatus('1', 'completed');

      expect(bookingRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          bookingStatus: 'completed',
          actualCheckOutTime: expect.any(Date),
        } as any),
      );
      expect(roomRepository.update).toHaveBeenCalledWith('r1', {
        status: 'available',
      });
    });

    it('should update booking status and set room to available when cancelled', async () => {
      const booking = { id: '1', roomId: 'r1' } as Booking;
      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await service.updateStatus('1', 'cancelled');

      expect(bookingRepository.update).toHaveBeenCalledWith('1', {
        bookingStatus: 'cancelled',
      });
      expect(roomRepository.update).toHaveBeenCalledWith('r1', {
        status: 'available',
      });
    });
  });

  describe('cancelBooking', () => {
    it('should throw ForbiddenException if user is not the owner', async () => {
      const booking = {
        id: '1',
        userId: 'user1',
        checkInDate: '2026-10-10',
      } as unknown as Booking;
      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await expect(service.cancelBooking('1', 'user2')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should successfully cancel booking and apply a 50% penalty if within 48 hours of check-in', async () => {
      // Mock current date to be exactly 24 hours before check-in midnight
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + 1);

      const booking = {
        id: '1',
        userId: 'user1',
        checkInDate: checkInDate.toISOString().split('T')[0],
        totalPrice: 100,
        paymentStatus: 'paid',
        stripePaymentIntentId: 'pi_test',
      } as unknown as Booking;

      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await service.cancelBooking('1', 'user1');
      expect(bookingRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          bookingStatus: 'cancelled',
          paymentStatus: 'partially_refunded',
          refundedAmount: 50,
        }),
      );
    });

    it('should successfully cancel booking and provide full refund if outside 48 hours', async () => {
      // Mock check-in 5 days from now
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + 5);

      const booking = {
        id: '1',
        userId: 'user1',
        checkInDate: checkInDate.toISOString().split('T')[0],
        totalPrice: 100,
        paymentStatus: 'paid',
        stripePaymentIntentId: 'pi_test',
      } as unknown as Booking;

      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await service.cancelBooking('1', 'user1');

      expect(bookingRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          bookingStatus: 'cancelled',
          paymentStatus: 'refunded',
          refundedAmount: 100,
        }),
      );
    });
  });
});
