import { Injectable } from '@nestjs/common';
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
    return this.journalEntryRepository.create({
      dateAdded: new Date(),
      description: description,
      user: user,
      username: user.username,
      title: title,
    });
  }
}
