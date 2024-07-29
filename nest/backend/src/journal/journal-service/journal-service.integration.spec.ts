import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal-service';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { ForbiddenException } from '@nestjs/common';

describe('JournalService (integration tests)', () => {
  let provider: JournalService;
  let repo: Repository<JournalEntry>;
  let userRepo: Repository<User>;
  const password = 'ajskfnU7';
  const username = 'marin';
  const title = 'My first entry';
  const description = 'Today was boring...';
  const user: User = {
    bmiEntries: [],
    isAdmin: 0,
    journalEntries: [],
    password: password,
    username: username,
  };

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

  const userWithJournalEntry: User = {
    bmiEntries: [],
    isAdmin: 0,
    journalEntries: [journalEntry],
    password: password,
    username: username,
  };

  const userWithJournalEntryPreviousDay: User = {
    bmiEntries: [],
    isAdmin: 0,
    journalEntries: [journalEntryPreviousDay],
    password: password,
    username: username,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [JournalEntry, User, Bmientry],
        }),
        TypeOrmModule.forFeature([JournalEntry, User, Bmientry]),
      ],
      providers: [JournalService],
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
      await userRepo.save(user);
      const userNoEntries = await userRepo.findOne({
        where: { username: user.username },
        relations: ['journalEntries'],
      });
      await expect(
        provider.getJournalEntries(userNoEntries),
      ).rejects.toBeInstanceOf(ForbiddenException);
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
});
