import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal-service';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';

describe('JournalService (unit tests)', () => {
  let provider: JournalService;
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

  const mockJournalRepository = { create: jest.fn() };
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
      providers: [
        JournalService,
        {
          provide: getRepositoryToken(JournalEntry),
          useValue: mockJournalRepository,
        },
      ],
    }).compile();

    provider = module.get<JournalService>(JournalService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createJournalEntry', () => {
    it('should create journal entry with parameters when no entries exist', async () => {
      mockJournalRepository.create.mockReturnValue(journalEntry);
      await expect(
        provider.createJournalEntry(user, title, description),
      ).resolves.toEqual(journalEntry);

      expect(mockJournalRepository.create).toHaveBeenCalled();
    });

    it('should throw exception if journal entry with current date exists', async () => {
      mockJournalRepository.create.mockReturnValue(journalEntry);
      await expect(
        provider.createJournalEntry(userWithJournalEntry, title, description),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should create new journal entry if journal entry with different date date exists', async () => {
      mockJournalRepository.create.mockReturnValue(journalEntry);
      await expect(
        provider.createJournalEntry(
          userWithJournalEntryPreviousDay,
          title,
          description,
        ),
      ).resolves.toEqual(journalEntry);
    });
  });
});
