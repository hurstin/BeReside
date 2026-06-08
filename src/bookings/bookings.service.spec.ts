import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Room } from '../rooms/room.entity';
import { NotFoundException } from '@nestjs/common';

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
  let stripeClient: { checkout: { sessions: { create: jest.Mock } } };

  beforeEach(async () => {
    bookingRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    roomRepository = {
      update: jest.fn(),
    };

    stripeClient = {
      checkout: {
        sessions: {
          create: jest.fn(),
        },
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
        relations: { user: true, room: true },
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
        relations: { user: true, room: true },
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

      expect(bookingRepository.update).toHaveBeenCalledWith('1', {
        bookingStatus: 'checked-in',
      });
      expect(roomRepository.update).toHaveBeenCalledWith('r1', {
        status: 'occupied',
      });
    });

    it('should update booking status and set room to available when completed', async () => {
      const booking = { id: '1', roomId: 'r1' } as Booking;
      jest.spyOn(service, 'findById').mockResolvedValue(booking);

      await service.updateStatus('1', 'completed');

      expect(bookingRepository.update).toHaveBeenCalledWith('1', {
        bookingStatus: 'completed',
      });
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
});
