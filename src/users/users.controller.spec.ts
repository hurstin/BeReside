import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    updatePassword: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updatePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];
      usersService.findAll?.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      usersService.findById?.mockResolvedValue(user);

      const result = await controller.findOne('1');
      expect(result).toEqual(user);
      expect(usersService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('updateRole', () => {
    it('should update the user role', async () => {
      const updatedUser = { id: '1', role: 'staff' } as User;
      usersService.update?.mockResolvedValue(updatedUser);

      const result = await controller.updateRole('1', { role: 'staff' });
      expect(result).toEqual(updatedUser);
      expect(usersService.update).toHaveBeenCalledWith('1', { role: 'staff' });
    });
  });

  describe('remove', () => {
    it('should remove the user and return success message', async () => {
      usersService.remove?.mockResolvedValue(undefined);

      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'User successfully removed' });
      expect(usersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
