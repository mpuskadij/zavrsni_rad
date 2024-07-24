import { Test, TestingModule } from '@nestjs/testing';
import { BmiService } from './bmi-service';
import {
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users-service/users-service';
import { User } from '../../entities/user/user';

describe('BmiService (unit tests)', () => {
  let provider: BmiService;
  const mockBmiRepository = { save: jest.fn(), create: jest.fn() };
  const mockUsersService = { getUser: jest.fn(), saveUserData: jest.fn() };
  const username: string = 'marin';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BmiService,
        {
          provide: getRepositoryToken(Bmientry),
          useValue: mockBmiRepository,
        },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    provider = module.get<BmiService>(BmiService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('addNewBmiEntry', () => {
    it('should return true when new bmi entry is added to database', async () => {
      const user: User = {
        username: username,
        isAdmin: 0,
        password: '123456Hj',
        bmiEntries: [],
      };
      const weight: number = 66.7;
      const height: number = 180;
      const squaredHeight: number = Math.pow(height, 2);
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(),
        username: username,
        user: user,
      };

      mockBmiRepository.save.mockResolvedValue(bmiEntry);
      mockBmiRepository.create.mockReturnValue(bmiEntry);
      mockUsersService.getUser.mockResolvedValue(user);

      return provider
        .addNewBmiEntry(username, weight, height)
        .then((result) => {
          expect(result).toBe(true);
          expect(mockBmiRepository.create).toHaveBeenCalled();
          expect(mockUsersService.saveUserData).toHaveBeenCalled();
        });
    });

    it('should throw error when negative weight passed', async () => {
      const weight: number = -66.7;
      const height: number = 180;

      try {
        const result: boolean = await provider.addNewBmiEntry(
          username,
          weight,
          height,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotAcceptableException);
      }
    });

    it('should return false when negative height passed', async () => {
      const weight: number = 66.7;
      const height: number = -180;

      try {
        const result: boolean = await provider.addNewBmiEntry(
          username,
          weight,
          height,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotAcceptableException);
      }
    });

    it('should throw exception when getUser returns null', async () => {
      const weight: number = 66.7;
      const height: number = 180;
      const squaredHeight: number = Math.pow(height, 2);
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(),
        username: 'marin',
        user: null,
      };
      mockUsersService.getUser.mockResolvedValue(null);

      return provider
        .addNewBmiEntry(username, weight, height)
        .then()
        .catch((error) => {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        });
    });

    it('should throw exception if saving to database failed', async () => {
      const user: User = {
        username: username,
        isAdmin: 0,
        password: '123456Hj',
        bmiEntries: [],
      };
      const weight: number = 66.7;
      const height: number = 180;
      const squaredHeight: number = Math.pow(height, 2);
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(),
        username: username,
        user: user,
      };

      mockBmiRepository.create.mockReturnValue(bmiEntry);
      mockUsersService.getUser.mockResolvedValue(user);
      mockUsersService.saveUserData.mockResolvedValue(false);

      return provider
        .addNewBmiEntry(username, weight, height)
        .then()
        .catch((error) => {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        });
    });
  });
});
