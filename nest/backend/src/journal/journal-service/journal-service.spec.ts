import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal-service';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { constants } from 'node:buffer';

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
      const result = await provider.createJournalEntry(
        user,
        title,
        description,
      );

      expect(result.title).toEqual(title);
      expect(result.description).toEqual(description);
    });

    it('should throw exception if journal entry with current date exists', async () => {
      mockJournalRepository.create.mockReturnValue(journalEntry);
      await expect(
        provider.createJournalEntry(userWithJournalEntry, title, description),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should create new journal entry if journal entry with different date date exists', async () => {
      mockJournalRepository.create.mockReturnValue(journalEntry);
      const result = await provider.createJournalEntry(
        userWithJournalEntryPreviousDay,
        title,
        description,
      );
      expect(result.title).toEqual(title);
      expect(result.description).toEqual(description);
    });
  });

  describe('getJournalEntries', () => {
    it('should throw ForbiddenException if user has no journal entries', async () => {
      await expect(provider.getJournalEntries(user)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('should throw InternalServer Exception is user is null', async () => {
      await expect(provider.getJournalEntries(null)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
    it('should return array if one entry exists', async () => {
      await expect(
        provider.getJournalEntries(userWithJournalEntry),
      ).resolves.toHaveLength(1);
    });
  });
});
