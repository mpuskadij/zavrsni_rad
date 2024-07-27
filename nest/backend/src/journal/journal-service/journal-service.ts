import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { User } from '../../entities/user/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JournalService {
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
        user.journalEntries.find(
          (entry) =>
            entry.dateAdded.getDate() == currentDate.getDate() &&
            entry.dateAdded.getFullYear() == currentDate.getFullYear() &&
            entry.dateAdded.getMonth() == currentDate.getMonth(),
        ) != undefined;
      if (entryWithSameDateExists) {
        throw new ForbiddenException(
          'There can only be 1 journal entry in the same day!',
        );
      }
    }
  }
}
