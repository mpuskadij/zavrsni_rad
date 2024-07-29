import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { User } from '../../entities/user/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntryDto } from '../../dtos/journal-entry-dto/journal-entry-dto';
import { title } from 'node:process';

@Injectable()
export class JournalService {
  async updateEntry(
    allJournalEntries: JournalEntry[],
    journalEntryToUpdate: JournalEntryDto,
  ): Promise<void> {
    if (!allJournalEntries?.length) {
      throw new ForbiddenException("You don't have any journal entries!");
    }
    const foundJournalEntry = await this.compareDates(
      allJournalEntries,
      journalEntryToUpdate.dateAdded,
    );
    if (!foundJournalEntry)
      throw new BadRequestException(
        "You don't have a journal entry on the date: " +
          journalEntryToUpdate.dateAdded.getDate() +
          '.' +
          journalEntryToUpdate.dateAdded.getMonth() +
          '.' +
          journalEntryToUpdate.dateAdded.getFullYear(),
      );
    if (
      foundJournalEntry.title == journalEntryToUpdate.title &&
      foundJournalEntry.description == journalEntryToUpdate.description
    ) {
      throw new BadRequestException(
        'Server requires different title and/or description to update entry!',
      );
    }
    foundJournalEntry.title = journalEntryToUpdate.title;
    foundJournalEntry.description = journalEntryToUpdate.description;

    return;
  }
  private async compareDates(
    journalEntries: JournalEntry[],
    dateToCompareTo: Date,
  ): Promise<JournalEntry> {
    return journalEntries.find(
      (entry) =>
        entry.dateAdded.getDate() == dateToCompareTo.getDate() &&
        entry.dateAdded.getFullYear() == dateToCompareTo.getFullYear() &&
        entry.dateAdded.getMonth() == dateToCompareTo.getMonth(),
    );
  }

  async getJournalEntries(user: User): Promise<JournalEntry[]> {
    if (!user) {
      throw new InternalServerErrorException('User not found!');
    }
    const noJournalEntries = !user.journalEntries.length;
    if (noJournalEntries) {
      throw new ForbiddenException("You don't have any journal entries!");
    }

    return user.journalEntries;
  }
  constructor(
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
  ) {}
  async createJournalEntry(
    user: User,
    title: string,
    description: string,
  ): Promise<JournalEntry> {
    await this.canNewJournalEntryBeCreated(user);
    const journalEntry: JournalEntry = new JournalEntry();
    journalEntry.dateAdded = new Date();
    journalEntry.description = description;
    journalEntry.title = title;
    journalEntry.username = user.username;

    return journalEntry;
  }

  private async canNewJournalEntryBeCreated(user: User): Promise<void> {
    const hasAtLeastOneJournalEntry = user.journalEntries?.length > 0;
    if (hasAtLeastOneJournalEntry) {
      const currentDate = new Date();
      const entryWithSameDateExists: boolean =
        (await this.compareDates(user.journalEntries, currentDate)) !=
        undefined;
      if (entryWithSameDateExists) {
        throw new ForbiddenException(
          'There can only be 1 journal entry in the same day!',
        );
      }
    }
  }
}
