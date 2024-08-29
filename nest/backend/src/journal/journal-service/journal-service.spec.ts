import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal-service';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { constants } from 'node:buffer';
import { JournalEntryDto } from '../../dtos/journal-entry-dto/journal-entry-dto';
import { VirtualTimeService } from '../../admin/virtual-time-service/virtual-time-service';

describe('JournalService (unit tests)', () => {
  let provider: JournalService;
  const password = 'ajskfnU7';
  const username = 'marin';
  const title = 'My first entry';
  const description = 'Today was boring...';
  const user = new User();
  user.username = username;
  user.password = password;
  user.journalEntries = [];

  const mockJournalRepository = { save: jest.fn(), remove: jest.fn() };
  const mockVirtualTimeService = { getTime: jest.fn() };
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

  const journalDTOPreviousDay: JournalEntryDto = {
    id: 1,
    dateAdded: userWithJournalEntryPreviousDay.journalEntries[0].dateAdded,
    description: userWithJournalEntryPreviousDay.journalEntries[0].description,
    title: userWithJournalEntryPreviousDay.journalEntries[0].title,
    username: userWithJournalEntryPreviousDay.username,
  };

  const journalDTOPreviousDayDifferent: JournalEntryDto = {
    id: 1,
    dateAdded: userWithJournalEntryPreviousDay.journalEntries[0].dateAdded,
    description: userWithJournalEntryPreviousDay.journalEntries[0].description,
    title:
      userWithJournalEntryPreviousDay.journalEntries[0].title + '. It was fun.',
    username: userWithJournalEntryPreviousDay.username,
  };

  const journalDTOPreviousDayDifferentTitleAndDescription: JournalEntryDto = {
    id: 1,
    dateAdded: userWithJournalEntryPreviousDay.journalEntries[0].dateAdded,
    description:
      userWithJournalEntryPreviousDay.journalEntries[0].description + ' Cool.',
    title:
      userWithJournalEntryPreviousDay.journalEntries[0].title + '. It was fun.',
    username: userWithJournalEntryPreviousDay.username,
  };

  const journalDTOPreviousDayDifferentDescription: JournalEntryDto = {
    id: 1,
    dateAdded: userWithJournalEntryPreviousDay.journalEntries[0].dateAdded,
    description:
      userWithJournalEntryPreviousDay.journalEntries[0].description +
      '. It was fun.',
    title: userWithJournalEntryPreviousDay.journalEntries[0].title,
    username: userWithJournalEntryPreviousDay.username,
  };
  const journalDTONow: JournalEntryDto = {
    id: 1,
    dateAdded: userWithJournalEntry.journalEntries[0].dateAdded,
    description: userWithJournalEntry.journalEntries[0].description,
    title: userWithJournalEntry.journalEntries[0].title,
    username: userWithJournalEntry.username,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JournalEntryDto],
      providers: [
        JournalService,
        {
          provide: getRepositoryToken(JournalEntry),
          useValue: mockJournalRepository,
        },
        { provide: VirtualTimeService, useValue: mockVirtualTimeService },
      ],
    }).compile();

    provider = module.get<JournalService>(JournalService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createJournalEntry', () => {
    it('should create journal entry with parameters when no entries exist', async () => {
      const result = await provider.createJournalEntry(
        user,
        title,
        description,
      );

      expect(result.title).toEqual(title);
      expect(result.description).toEqual(description);
    });

    it('should throw exception if journal entry with current date exists', async () => {
      mockVirtualTimeService.getTime.mockResolvedValue(new Date());
      await expect(
        provider.createJournalEntry(userWithJournalEntry, title, description),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should create new journal entry if journal entry with different date date exists', async () => {
      mockVirtualTimeService.getTime.mockResolvedValue(new Date());
      mockJournalRepository.save.mockResolvedValue(
        userWithJournalEntryPreviousDay,
      );
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

  describe('updateEntry', () => {
    it('should throw ForbiddenException if user has 0 journal entries', async () => {
      const dateAdded = new Date();
      await expect(
        provider.updateEntry(user.journalEntries, journalDTONow),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if user doesnt have any entry with matching id', async () => {
      const currentDate = new Date();
      await expect(
        provider.updateEntry(userWithJournalEntry.journalEntries, {
          id: userWithJournalEntry.journalEntries[0].id + 1,
          title: '',
          description: '',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should not update entry if title and description remained the same', async () => {
      const currentDate = new Date();
      await provider.updateEntry(
        userWithJournalEntryPreviousDay.journalEntries,
        journalDTOPreviousDay,
      );
      expect(userWithJournalEntry.journalEntries[0].title).toBe(
        journalDTOPreviousDay.title,
      );
      expect(userWithJournalEntry.journalEntries[0].description).toBe(
        journalDTOPreviousDay.description,
      );
    });

    it('should update journal entry when title different', async () => {
      await provider.updateEntry(
        userWithJournalEntryPreviousDay.journalEntries,
        journalDTOPreviousDayDifferent,
      );
      expect(userWithJournalEntryPreviousDay.journalEntries).toHaveLength(1);
      expect(userWithJournalEntryPreviousDay.journalEntries[0].title).toEqual(
        journalDTOPreviousDayDifferent.title,
      );
    });

    it('should update journal entry when description different', async () => {
      await provider.updateEntry(
        userWithJournalEntryPreviousDay.journalEntries,
        journalDTOPreviousDayDifferentDescription,
      );
      expect(userWithJournalEntryPreviousDay.journalEntries).toHaveLength(1);
      expect(
        userWithJournalEntryPreviousDay.journalEntries[0].description,
      ).toEqual(journalDTOPreviousDayDifferentDescription.description);
    });

    it('should update journal entry when title and description different', async () => {
      await provider.updateEntry(
        userWithJournalEntryPreviousDay.journalEntries,
        journalDTOPreviousDayDifferentTitleAndDescription,
      );
      expect(userWithJournalEntryPreviousDay.journalEntries).toHaveLength(1);
      expect(userWithJournalEntryPreviousDay.journalEntries[0].title).toEqual(
        journalDTOPreviousDayDifferentTitleAndDescription.title,
      );
      expect(
        userWithJournalEntryPreviousDay.journalEntries[0].description,
      ).toEqual(journalDTOPreviousDayDifferentTitleAndDescription.description);
    });
  });

  describe('deleteEntry', () => {
    it('should throw ForbiddenException if user has no journal entries', async () => {
      await expect(
        provider.deleteEntry(user.journalEntries, journalDTONow),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if user has journal entry, but the id sent is incorrect', async () => {
      await expect(
        provider.deleteEntry(userWithJournalEntry.journalEntries, {
          id: userWithJournalEntry.journalEntries[0].id + 1,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should remove entry from user and user should have number of entries == 0 when the only entry was removed', async () => {
      mockJournalRepository.remove.mockResolvedValue(
        userWithJournalEntry.journalEntries[0],
      );
      const result = await provider.deleteEntry(
        userWithJournalEntry.journalEntries,
        journalDTONow,
      );

      expect(result.dateAdded).toEqual(journalDTONow.dateAdded);
      expect(result.username).toEqual(userWithJournalEntry.username);
    });
  });
});
