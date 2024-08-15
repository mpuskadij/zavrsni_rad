import { Test, TestingModule } from '@nestjs/testing';
import { BmiService } from './bmi-service';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users-service/users-service';
import { User } from '../../entities/user/user';
import { BmiEntryDto } from '../../dtos/bmi-entry-dto/bmi-entry-dto';
import { DtosModule } from '../../dtos/dtos.module';
import { VirtualTimeService } from '../../admin/virtual-time-service/virtual-time-service';

describe('BmiService (unit tests)', () => {
  let provider: BmiService;
  const mockBmiRepository = { save: jest.fn(), create: jest.fn() };
  const mockUsersService = { getUser: jest.fn(), saveUserData: jest.fn() };
  const mockVirtualTimeService = { getTime: jest.fn() };
  const username: string = 'marin';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DtosModule],
      providers: [
        BmiService,
        {
          provide: getRepositoryToken(Bmientry),
          useValue: mockBmiRepository,
        },
        { provide: UsersService, useValue: mockUsersService },
        { provide: VirtualTimeService, useValue: mockVirtualTimeService },
      ],
    }).compile();

    provider = module.get<BmiService>(BmiService);
  });

  describe('addNewBmiEntry', () => {
    it('should return bmi when new bmi entry is added to database', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
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
      mockVirtualTimeService.getTime.mockResolvedValue(new Date());

      return provider
        .addNewBmiEntry(username, weight, height)
        .then((result) => {
          expect(result).toBe(Number((weight / squaredHeight).toPrecision(3)));
          expect(mockBmiRepository.create).toHaveBeenCalled();
          expect(mockUsersService.saveUserData).toHaveBeenCalled();
        });
    });

    it('should throw error when negative weight passed', async () => {
      const weight: number = -66.7;
      const height: number = 180;

      try {
        const result: number = await provider.addNewBmiEntry(
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
        const result: number = await provider.addNewBmiEntry(
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
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
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

    it('should throw exception if less that 7 days have passed!', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
      const weight: number = 66.7;
      const height: number = 1.8;
      const squaredHeight: number = Math.pow(height, 2);
      const sixDaysAgo = new Date().getTime() - 6 * 24 * 60 * 60 * 1000;
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(sixDaysAgo),
        username: username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);

      await expect(
        provider.addNewBmiEntry(user.username, weight, height),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should return bmi if 7 days passed', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
      const weight: number = 66.7;
      const height: number = 1.8;
      const squaredHeight: number = Math.pow(height, 2);
      const sixDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(sixDaysAgo),
        username: username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);

      mockBmiRepository.create.mockReturnValue(bmiEntry);
      mockUsersService.getUser.mockResolvedValue(user);
      mockUsersService.saveUserData.mockResolvedValue(true);

      await expect(
        provider.addNewBmiEntry(user.username, weight, height),
      ).resolves.toEqual(Number((weight / squaredHeight).toPrecision(3)));
    });

    it('should return bmi if 8 days passed', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
      const weight: number = 66.7;
      const height: number = 1.8;
      const squaredHeight: number = Math.pow(height, 2);
      const sixDaysAgo = new Date().getTime() - 8 * 24 * 60 * 60 * 1000;
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(sixDaysAgo),
        username: username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);

      mockBmiRepository.create.mockReturnValue(bmiEntry);
      mockUsersService.getUser.mockResolvedValue(user);
      mockUsersService.saveUserData.mockResolvedValue(true);

      await expect(
        provider.addNewBmiEntry(user.username, weight, height),
      ).resolves.toEqual(Number((weight / squaredHeight).toPrecision(3)));
    });

    it('should return true if it is the first bmi entry of the user', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
      const weight: number = 66.7;
      const height: number = 1.8;
      const squaredHeight: number = Math.pow(height, 2);
      const sixDaysAgo = new Date().getTime() - 6 * 24 * 60 * 60 * 1000;
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(sixDaysAgo),
        username: user.username,
        user: user,
      };

      mockBmiRepository.create.mockReturnValue(bmiEntry);
      mockUsersService.getUser.mockResolvedValue(user);
      mockUsersService.saveUserData.mockResolvedValue(true);

      await expect(
        provider.addNewBmiEntry(user.username, weight, height),
      ).resolves.toEqual(Number((weight / squaredHeight).toPrecision(3)));
    });
  });

  describe('getAllBmiEntriesFromUser', () => {
    it('should throw internal server error is user is null', async () => {
      mockUsersService.getUser.mockResolvedValue(null);
      await expect(
        provider.getAllBmiEntriesFromUser(username),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should throw forbidden exception if user has no bmi entries', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
      mockUsersService.getUser.mockResolvedValue(user);
      await expect(
        provider.getAllBmiEntriesFromUser(username),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should return array of bmi entries as dto when user exists and ahs at elast one entry', async () => {
      const user = new User();
      user.username = username;
      user.password = 'sdasd';
      user.isAdmin = 0;
      user.bmiEntries = [];
      const weight: number = 66.7;
      const height: number = 1.8;
      const squaredHeight: number = Math.pow(height, 2);
      const fourDaysAgo = new Date().getTime() - 4 * 24 * 60 * 60 * 1000;
      const bmiEntry: Bmientry = {
        bmi: weight / squaredHeight,
        dateAdded: new Date(fourDaysAgo),
        username: user.username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);
      mockUsersService.getUser.mockResolvedValue(user);
      await expect(
        provider.getAllBmiEntriesFromUser(username),
      ).resolves.toHaveLength(1);
    });
  });
});
