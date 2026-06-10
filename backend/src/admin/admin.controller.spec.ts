import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: {
    getDashboardStats: jest.Mock;
  };

  beforeEach(async () => {
    adminService = {
      getDashboardStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: adminService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardStats', () => {
    it('should call adminService.getDashboardStats and return the result', async () => {
      const expectedStats = {
        totalUsers: 5,
        totalRooms: 10,
        occupiedRooms: 3,
        occupancyRate: 30,
        totalRevenue: 500,
        pendingBookings: 2,
        confirmedBookings: 1,
      };

      adminService.getDashboardStats?.mockResolvedValue(expectedStats);

      const result = await controller.getDashboardStats();

      expect(adminService.getDashboardStats).toHaveBeenCalled();
      expect(result).toEqual(expectedStats);
    });
  });
});
