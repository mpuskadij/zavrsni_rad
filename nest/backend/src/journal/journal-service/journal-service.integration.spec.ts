import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal-service';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { BmiEntryDto } from 'src/dtos/bmi-entry-dto/bmi-entry-dto';
import { JournalEntryDto } from 'src/dtos/journal-entry-dto/journal-entry-dto';
import { UsersService } from '../../users/users-service/users-service';
import { CryptoService } from '../../crpyto/crypto-service/crypto-service';
import { AuthenticationService } from '../../authentication/authentication-service/authentication-service';
import { CrpytoModule } from '../../crpyto/crpyto.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeleteJournalEntryDto } from '../../dtos/journal-entry-dto/delete-journal-entry-dto';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { Exercise } from '../../entities/exercise/exercise';
import { Food } from '../../entities/food/food';
import { UserFood } from '../../entities/user_food/user_food';
import { AdminModule } from '../../admin/admin.module';
import { VirtualTimeService } from '../../admin/virtual-time-service/virtual-time-service';

describe('JournalService (integration tests)', () => {
  let provider: JournalService;
  let repo: Repository<JournalEntry>;
  let userRepo: Repository<User>;
  let usersService: UsersService;
  const password = 'ajskfnU7';
  const username = 'marin';
  const title = 'My first entry';
  const description = 'Today was boring...';
  const user = new User();
  user.username = username;
  user.password = password;
  user.journalEntries = [];

  const journalEntry: JournalEntry = {
    dateAdded: new Date(),
    description: description,
    title: title,
    user: user,
    username: username,
  };
  const journalEntryPreviousDay: JournalEntry = {
    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: description,
    title: title,
    user: user,
    username: username,
  };

  const userWithJournalEntry = new User();
  userWithJournalEntry.username = username;
  userWithJournalEntry.password = password;
  userWithJournalEntry.journalEntries = [journalEntry];
  user.isAdmin = false;

  const userWithJournalEntryPreviousDay = new User();
  userWithJournalEntryPreviousDay.username = username;
  userWithJournalEntryPreviousDay.password = password;
  userWithJournalEntryPreviousDay.journalEntries = [journalEntryPreviousDay];
  user.isAdmin = false;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [
            JournalEntry,
            User,
            Bmientry,
            WorkoutPlan,
            Exercise,
            Food,
            UserFood,
          ],
        }),
        AdminModule,
        ConfigModule.forRoot(),
        CrpytoModule,
        TypeOrmModule.forFeature([
          JournalEntry,
          User,
          Bmientry,
          WorkoutPlan,
          Exercise,
          Food,
          UserFood,
        ]),
      ],
      providers: [
        JournalService,
        UsersService,
        AuthenticationService,
        JwtService,
        ConfigService,
        VirtualTimeService,
      ],
    }).compile();

    provider = module.get<JournalService>(JournalService);
    repo = module.get<Repository<JournalEntry>>(
      getRepositoryToken(JournalEntry),
    );

    userRepo = module.get<Repository<User>>(getRepositoryToken(User));

    let userInDatabase = await userRepo.findOne({
      where: { username: username },
      relations: ['journalEntries', 'bmiEntries'],
    });
    if (userInDatabase) {
      await userRepo.remove(userInDatabase);
    }

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createJournalEntry', () => {
    it('should create journal entry with parameters when no previous entries', async () => {
      const currentDate = new Date();
      const result = await provider.createJournalEntry(
        user,
        title,
        description,
      );
      expect(result).not.toBeNull();
      expect(result.description).toEqual(description);
      expect(result.title).toEqual(title);
      expect(result.dateAdded.getDay()).toEqual(currentDate.getDay());
      expect(result.dateAdded.getFullYear()).toEqual(currentDate.getFullYear());
      expect(result.dateAdded.getMonth()).toEqual(currentDate.getMonth());
    });

    it('should throw error if entry with same date already exists', async () => {
      await expect(
        provider.createJournalEntry(userWithJournalEntry, title, description),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should return journal entry if entry with previous day exists', async () => {
      const currentDate = new Date();
      const result = await provider.createJournalEntry(
        userWithJournalEntryPreviousDay,
        title,
        description,
      );
      expect(result).not.toBeNull();
      expect(result.description).toEqual(description);
      expect(result.title).toEqual(title);
      expect(result.dateAdded.getDay()).toEqual(currentDate.getDay());
      expect(result.dateAdded.getFullYear()).toEqual(currentDate.getFullYear());
      expect(result.dateAdded.getMonth()).toEqual(currentDate.getMonth());
    });
  });

  describe('getJournalEntries', () => {
    it('should throw ForbiddenException if user has no journal entries', async () => {
      const dbUser = await userRepo.save(user);
      await expect(provider.getJournalEntries(dbUser)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('should return correct number of entries if entries exist', async () => {
      await userRepo.save(userWithJournalEntry);
      const userWithEntry = await userRepo.findOne({
        where: { username: userWithJournalEntry.username },
        relations: ['journalEntries'],
      });
      await expect(
        provider.getJournalEntries(userWithEntry),
      ).resolves.toHaveLength(1);
    });
  });

  describe('updateEntry', () => {
    it('should throw ForbiddenException if user has 0 entries', async () => {
      const dbUSer = await userRepo.save(user);

      await expect(
        provider.updateEntry(dbUSer.journalEntries, null),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if user has journal entries, but the date that is passed is incorrect', async () => {
      const userWithEntry = new User();
      userWithEntry.username = username;
      userWithEntry.password = password;
      userWithEntry.isAdmin = false;
      userWithEntry.journalEntries = [];
      const entry = new JournalEntry();
      entry.dateAdded = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      entry.description = 'Boring...';
      entry.title = 'First day!';
      userWithEntry.journalEntries.push(entry);
      const dbUser = await userRepo.save(userWithEntry);
      const sentData: JournalEntryDto = {
        dateAdded: new Date(),
        description: 'a',
        title: 'as',
      };
      await expect(
        provider.updateEntry(dbUser.journalEntries, sentData),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if user has journal entries, but the title and description passed are the same', async () => {
      const userWithEntry = new User();
      userWithEntry.username = username;
      userWithEntry.password = password;
      userWithEntry.isAdmin = false;
      userWithEntry.journalEntries = [];
      const entry = new JournalEntry();
      entry.dateAdded = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      entry.description = 'Boring...';
      entry.title = 'First day!';
      userWithEntry.journalEntries.push(entry);
      const dbUser = await userRepo.save(userWithEntry);
      const sentData: JournalEntryDto = {
        dateAdded: new Date(),
        description: entry.description,
        title: entry.title,
      };
      await expect(
        provider.updateEntry(dbUser.journalEntries, sentData),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('deleteEntry', () => {
    const incorrectlySentDto: JournalEntryDto = {
      dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      description: description,
      title: title,
    };

    it('should create throw ForbiddenException if user has 0 journal entries', async () => {
      await usersService.addUser(username, password);

      const userInDatabase = await usersService.getUser(username);

      await expect(
        provider.deleteEntry(userInDatabase.journalEntries, incorrectlySentDto),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should create throw BadRequestException if user has 1 entry, but incorrect date was sent', async () => {
      await usersService.addUser(username, password);

      const userInDatabase = await usersService.getUser(username);

      const entry = await provider.createJournalEntry(user, title, description);

      await usersService.assignJournalEntry(userInDatabase, entry);

      await expect(
        provider.deleteEntry(userInDatabase.journalEntries, incorrectlySentDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should return deleted entry if correct date sent', async () => {
      await usersService.addUser(username, password);

      const userInDatabase = await usersService.getUser(username);

      const entry = await provider.createJournalEntry(user, title, description);

      const userSentData: DeleteJournalEntryDto = {
        dateAdded: entry.dateAdded,
      };

      await usersService.assignJournalEntry(userInDatabase, entry);

      const result = await provider.deleteEntry(
        userInDatabase.journalEntries,
        userSentData,
      );

      expect(result.dateAdded).toEqual(entry.dateAdded);
      expect(result.username).toEqual(entry.username);
    });
  });
});
