import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Booking } from './booking.entity';

describe('BookingsController', () => {
  let controller: BookingsController;
  let bookingsService: {
    createBooking: jest.Mock;
    getUserBookings: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(async () => {
    bookingsService = {
      createBooking: jest.fn(),
      getUserBookings: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: bookingsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bookings', async () => {
      const bookings = [{ id: '1' }] as Booking[];
      bookingsService.findAll?.mockResolvedValue(bookings);

      const result = await controller.findAll();
      expect(result).toEqual(bookings);
      expect(bookingsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single booking', async () => {
      const booking = { id: '1' } as Booking;
      bookingsService.findById?.mockResolvedValue(booking);

      const result = await controller.findOne('1');
      expect(result).toEqual(booking);
      expect(bookingsService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateStatus', () => {
    it('should update the booking status', async () => {
      const booking = { id: '1', bookingStatus: 'checked-in' } as Booking;
      bookingsService.updateStatus?.mockResolvedValue(booking);

      const result = await controller.updateStatus('1', {
        status: 'checked-in',
      });
      expect(result).toEqual(booking);
      expect(bookingsService.updateStatus).toHaveBeenCalledWith(
        '1',
        'checked-in',
      );
    });
  });
});
