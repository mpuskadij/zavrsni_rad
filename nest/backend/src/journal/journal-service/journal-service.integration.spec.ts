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
import { JwtModule, JwtService } from '@nestjs/jwt';
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
  let virtualTimeService: VirtualTimeService;
  const password = 'ajskfnU7';
  const username = 'marin';
  const title = 'My first entry';
  const description = 'Today was boring...';
  const user = new User();
  user.username = username;
  user.password = password;
  user.journalEntries = [];

  const journalEntry: JournalEntry = {
    id: 1,
    dateAdded: new Date(),
    description: description,
    title: title,
    user: user,
    username: username,
  };
  const journalEntryPreviousDay: JournalEntry = {
    id: 1,
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
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
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
        ConfigService,
        VirtualTimeService,
      ],
    }).compile();
    virtualTimeService = module.get<VirtualTimeService>(VirtualTimeService);

    provider = module.get<JournalService>(JournalService);
    repo = module.get<Repository<JournalEntry>>(
      getRepositoryToken(JournalEntry),
    );

    userRepo = module.get<Repository<User>>(getRepositoryToken(User));

    let userInDatabase = await userRepo.findOne({
      where: { username: username },
      relations: ['journalEntries', 'bmiEntries', 'userFoods', 'workoutPlans'],
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
      await userRepo.save(user);
      const result = await provider.createJournalEntry(
        user,
        title,
        description,
      );
      expect(result).not.toBeNull();
      expect(result.description).toEqual(description);
      expect(result.title).toEqual(title);
      const vTime = await virtualTimeService.getTime();
      expect(result.dateAdded.getDay()).toEqual(vTime.getDay());
      expect(result.dateAdded.getFullYear()).toEqual(vTime.getFullYear());
      expect(result.dateAdded.getMonth()).toEqual(vTime.getMonth());
    });

    it('should throw error if entry with same date already exists', async () => {
      journalEntry.dateAdded = await virtualTimeService.getTime();
      await expect(
        provider.createJournalEntry(userWithJournalEntry, title, description),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should return journal entry if entry with previous day exists', async () => {
      const vTime = await virtualTimeService.getTime();
      journalEntryPreviousDay.dateAdded = new Date(
        vTime.getTime() - 1 * 24 * 60 * 60 * 1000,
      );
      await userRepo.save(user);
      const result = await provider.createJournalEntry(
        userWithJournalEntryPreviousDay,
        title,
        description,
      );
      expect(result).not.toBeNull();
      expect(result.description).toEqual(description);
      expect(result.title).toEqual(title);
      expect(result.dateAdded.getDay()).toEqual(vTime.getDay());
      expect(result.dateAdded.getFullYear()).toEqual(vTime.getFullYear());
      expect(result.dateAdded.getMonth()).toEqual(vTime.getMonth());
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
      const dbUser = await userRepo.save(userWithJournalEntry);
      await expect(provider.getJournalEntries(dbUser)).resolves.toHaveLength(1);
    });
  });

  describe('updateEntry', () => {
    it('should throw ForbiddenException if user has 0 entries', async () => {
      const dbUSer = await userRepo.save(user);

      await expect(
        provider.updateEntry(dbUSer.journalEntries, null),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if user has journal entries, but the id that is passed is incorrect', async () => {
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
        id: dbUser.journalEntries[0].id + 1,
        dateAdded: new Date(),
        description: 'a',
        title: 'as',
      };
      await expect(
        provider.updateEntry(dbUser.journalEntries, sentData),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should not update if user has journal entries, but the title and description passed are the same', async () => {
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
        id: dbUser.journalEntries[0].id,
        dateAdded: new Date(),
        description: entry.description,
        title: entry.title,
      };
      await provider.updateEntry(dbUser.journalEntries, sentData);
      expect(dbUser.journalEntries[0].description).toBe('Boring...');
      expect(dbUser.journalEntries[0].title).toBe('First day!');
    });
  });

  describe('deleteEntry', () => {
    const incorrectlySentDto: JournalEntryDto = {
      id: 1,
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

    it('should return deleted entry if correct id', async () => {
      await usersService.addUser(username, password);

      const userInDatabase = await usersService.getUser(username);

      const entry = await provider.createJournalEntry(user, title, description);

      const userSentData: DeleteJournalEntryDto = {
        id: entry.id,
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
