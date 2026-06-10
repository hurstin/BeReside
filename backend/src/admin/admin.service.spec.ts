import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Booking } from '../bookings/booking.entity';
import { Room } from '../rooms/room.entity';

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: { count: jest.Mock };
  let roomRepository: { count: jest.Mock };
  let bookingRepository: { count: jest.Mock; createQueryBuilder: jest.Mock };

  beforeEach(async () => {
    userRepository = {
      count: jest.fn(),
    };

    roomRepository = {
      count: jest.fn(),
    };

    bookingRepository = {
      count: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: roomRepository,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should return correct dashboard statistics', async () => {
      userRepository.count?.mockResolvedValue(10);

      // Mock roomRepository.count implementation depending on arguments
      roomRepository.count?.mockImplementation(
        (options?: { where?: { status?: string } }) => {
          if (options?.where?.status === 'occupied') {
            return Promise.resolve(2);
          }
          return Promise.resolve(5); // total rooms
        },
      );

      // Mock booking count
      bookingRepository.count.mockImplementation(
        (options?: { where?: { bookingStatus?: string } }) => {
          if (options?.where?.bookingStatus === 'pending') {
            return Promise.resolve(3);
          }
          if (options?.where?.bookingStatus === 'confirmed') {
            return Promise.resolve(7);
          }
          return Promise.resolve(0);
        },
      );

      // Mock query builder for revenue
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ totalRevenue: '1500.50' }),
      };
      bookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getDashboardStats();

      expect(result).toEqual({
        totalUsers: 10,
        totalRooms: 5,
        occupiedRooms: 2,
        occupancyRate: 40, // (2/5) * 100
        totalRevenue: 1500.5,
        pendingBookings: 3,
        confirmedBookings: 7,
      });
    });

    it('should handle zero total rooms to prevent division by zero', async () => {
      userRepository.count?.mockResolvedValue(0);
      roomRepository.count?.mockResolvedValue(0);
      bookingRepository.count.mockResolvedValue(0);

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ totalRevenue: null }),
      };
      bookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getDashboardStats();

      expect(result.occupancyRate).toBe(0);
      expect(result.totalRevenue).toBe(0);
    });
  });
});
