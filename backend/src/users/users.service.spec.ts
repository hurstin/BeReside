/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: {
    findOne: jest.Mock;
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    softRemove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      softRemove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }] as User[];
      const queryBuilder: Record<string, jest.Mock> = {
        orderBy: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(users),
      };
      userRepository.createQueryBuilder?.mockReturnValue(queryBuilder);

      const result = await service.findAll();
      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'user.createdAt',
        'DESC',
      );
      expect(result).toEqual(users);
    });
  });

  describe('remove', () => {
    it('should successfully soft remove a user', async () => {
      const user = { id: '1', email: 'test@example.com' } as User;
      jest.spyOn(service, 'findById').mockResolvedValue(user);
      userRepository.softRemove?.mockResolvedValue(user);

      await expect(service.remove('1')).resolves.not.toThrow();
      expect(service.findById).toHaveBeenCalledWith('1');
      expect(userRepository.softRemove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.remove('invalid')).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.softRemove).not.toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);
      await expect(
        service.updatePassword('1', { oldPassword: 'old', newPassword: 'new' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if old password does not match', async () => {
      const user = { id: '1', passwordHash: 'hash' } as User;
      jest.spyOn(service, 'findById').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updatePassword('1', {
          oldPassword: 'wrong',
          newPassword: 'new',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update password hash if validation passes', async () => {
      const user = { id: '1', passwordHash: 'hash' } as User;
      jest.spyOn(service, 'findById').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');

      await service.updatePassword('1', {
        oldPassword: 'old',
        newPassword: 'new',
      });
      expect(userRepository.update).toHaveBeenCalledWith('1', {
        passwordHash: 'newHash',
      });
    });
  });
});
