import { ForbiddenException, Injectable } from '@nestjs/common';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { User } from '../../entities/user/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JournalService {
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
    const journalEntry: JournalEntry = this.journalEntryRepository.create({
      dateAdded: new Date(),
      description: description,
      title: title,
    });
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
