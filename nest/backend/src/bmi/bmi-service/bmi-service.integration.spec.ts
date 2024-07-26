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
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users-service/users-service';
import { User } from '../../entities/user/user';
import { UsersModule } from '../../users/users.module';
import { BmiModule } from '../bmi.module';
import { CrpytoModule } from '../../crpyto/crpyto.module';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CryptoService } from '../../crpyto/crypto-service/crypto-service';
import { HashGenerator } from '../../crpyto/hash-generator/hash-generator';
import { AuthenticationService } from '../../authentication/authentication-service/authentication-service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  GoogleRecaptchaGuard,
  GoogleRecaptchaModule,
} from '@nestlab/google-recaptcha';
import { AppModule } from '../../app.module';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';

describe('BmiService (integration tests)', () => {
  let provider: BmiService;
  let userRepo: Repository<User>;
  const username: string = 'marin';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BmiModule,
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Bmientry, JournalEntry],
        }),
        TypeOrmModule.forFeature([User, Bmientry, JournalEntry]),
      ],
      providers: [
        BmiService,
        UsersService,
        CryptoService,
        HashGenerator,
        AuthenticationService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    provider = module.get<BmiService>(BmiService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('addNewBmiEntry', () => {
    it('should throw error if getUser returns null', async () => {
      const user = await userRepo.findOneBy({ username: username });
      if (user != null) {
        await userRepo.remove(user);
      }
      return provider.addNewBmiEntry(username, 123, 123).catch((error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      });
    });

    it('should add new bmi entry in tables User and BmiEntry if it is the first bmi entry', async () => {
      const userExists = await userRepo.existsBy({ username: username });
      const weight: number = 65;
      const height: number = 1.8;
      if (userExists == false) {
        const user: User = {
          username: username,
          password: 'sdasd',
          bmiEntries: [],
          isAdmin: 0,
          journalEntries: [],
        };
        await userRepo.save(user);
      }
      return provider
        .addNewBmiEntry(username, weight, height)
        .then(async (result) => {
          const user = await userRepo.findOne({
            where: { username: username },
            relations: ['bmiEntries'],
          });
          expect(user).not.toBeNull();
          expect(user.bmiEntries).toHaveLength(1);

          const bmiEntry = user.bmiEntries[0];
          expect(bmiEntry).not.toBeNull();
          expect(bmiEntry.dateAdded.getTime() + 5000).toBeGreaterThanOrEqual(
            Date.now(),
          );
          const expectedBMI = Number(
            (weight / Math.pow(height, 2)).toPrecision(3),
          );
          expect(bmiEntry.bmi).toEqual(expectedBMI);
          expect(bmiEntry.username).toEqual(username);
        });
    });

    it('should throw error if 6 days passed between 2 bmi entries', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
      });
      const weight: number = 65;
      const height: number = 1.8;
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      const user: User = {
        username: username,
        password: 'sdasd',
        bmiEntries: [],
        journalEntries: [],
        isAdmin: 0,
      };
      const sixDaysAgo = Date.now() - 6 * 24 * 60 * 60 * 1000;

      const bmiEntry: Bmientry = {
        bmi: 20.5,
        dateAdded: new Date(sixDaysAgo),
        username: user.username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);
      await userRepo.save(user);
      await expect(
        provider.addNewBmiEntry(username, weight, height),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(user.bmiEntries).toHaveLength(1);
      expect(user.bmiEntries[0].dateAdded.getTime()).toEqual(sixDaysAgo);
    });

    it('return true if 7 days passed', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries'],
      });
      const weight: number = 65;
      const height: number = 1.8;
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      const user: User = {
        username: username,
        password: 'sdasd',
        bmiEntries: [],
        isAdmin: 0,
        journalEntries: [],
      };
      const sevenDaysAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

      const bmiEntry: Bmientry = {
        bmi: 20.5,
        dateAdded: new Date(sevenDaysAgo),
        username: username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);
      await userRepo.insert(user);
      await expect(
        provider.addNewBmiEntry(username, weight, height),
      ).resolves.toBe(Number((weight / Math.pow(height, 2)).toPrecision(3)));
    });

    it('return true if 8 days passed', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries'],
      });
      const weight: number = 65;
      const height: number = 1.8;
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      const user: User = {
        username: username,
        password: 'sdasd',
        bmiEntries: [],
        isAdmin: 0,
        journalEntries: [],
      };
      const eightDaysAgo = new Date().getTime() - 8 * 24 * 60 * 60 * 1000;

      const bmiEntry: Bmientry = {
        bmi: 20.5,
        dateAdded: new Date(eightDaysAgo),
        username: username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);
      await userRepo.insert(user);
      await expect(
        provider.addNewBmiEntry(username, weight, height),
      ).resolves.toBe(Number((weight / Math.pow(height, 2)).toPrecision(3)));
    });

    it('return false if 2 back to back entries are made', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries'],
      });
      const weight: number = 65;
      const height: number = 1.8;
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      const user: User = {
        username: username,
        password: 'sdasd',
        bmiEntries: [],
        isAdmin: 0,
        journalEntries: [],
      };

      await userRepo.insert(user);
      await provider.addNewBmiEntry(username, weight, height);
      await expect(
        provider.addNewBmiEntry(username, weight, height),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('getAllBmiEntriesFromUser', () => {
    it('should throw InternalServerException if user not found', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries'],
      });
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      await expect(
        provider.getAllBmiEntriesFromUser(username),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should throw ForbiddenException if user doesnt have any bmi entries', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries'],
      });
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      const user: User = {
        username: username,
        password: 'sdasd',
        bmiEntries: [],
        journalEntries: [],
        isAdmin: 0,
      };
      await userRepo.save(user);
      await expect(
        provider.getAllBmiEntriesFromUser(username),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should return one bmi entry if user has one bmi entry', async () => {
      const userExists = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries'],
      });
      if (userExists != null) {
        await userRepo.remove(userExists);
      }
      const user: User = {
        username: username,
        password: 'sdasd',
        bmiEntries: [],
        journalEntries: [],
        isAdmin: 0,
      };
      await userRepo.insert(user);
      const eightDaysAgo = new Date().getTime() - 8 * 24 * 60 * 60 * 1000;

      const bmiEntry: Bmientry = {
        bmi: 20.5,
        dateAdded: new Date(eightDaysAgo),
        username: username,
        user: user,
      };
      user.bmiEntries.push(bmiEntry);
      await userRepo.save(user);
      await expect(
        provider.getAllBmiEntriesFromUser(username),
      ).resolves.toHaveLength(1);
    });
  });
});
