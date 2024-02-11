import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      // Mock a user
      const mockUser = new User();
      mockUser.id = 1;
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const userId = 1;
      const foundUser = await service.findOneById(userId);
      expect(foundUser).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const userId = 1;
      await expect(service.findOneById(userId)).rejects.toThrowError(NotFoundException);
    });
  });

  // Add more test cases for other methods...
});
