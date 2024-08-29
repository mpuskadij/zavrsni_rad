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
import { DeleteJournalEntryDto } from '../../dtos/journal-entry-dto/delete-journal-entry-dto';
import { VirtualTimeService } from '../../admin/virtual-time-service/virtual-time-service';

@Injectable()
export class JournalService {
  async deleteEntry(
    journalEntriesOfUser: JournalEntry[],
    journalEntryUserWantsToDelete: DeleteJournalEntryDto,
  ): Promise<JournalEntry> {
    this.checkDoesUserHaveAtLeastOneEntry(journalEntriesOfUser);

    const foundJournalEntry = await this.findJournalEntry(
      journalEntriesOfUser,
      journalEntryUserWantsToDelete,
    );
    await this.journalEntryRepository.remove(foundJournalEntry);

    return foundJournalEntry;
  }
  async updateEntry(
    allJournalEntries: JournalEntry[],
    journalEntryToUpdate: JournalEntryDto,
  ): Promise<void> {
    this.checkDoesUserHaveAtLeastOneEntry(allJournalEntries);
    const foundJournalEntry = await this.findJournalEntry(
      allJournalEntries,
      journalEntryToUpdate,
    );
    if (
      foundJournalEntry.title == journalEntryToUpdate.title &&
      foundJournalEntry.description == journalEntryToUpdate.description
    ) {
      return;
    }
    foundJournalEntry.title = journalEntryToUpdate.title;
    foundJournalEntry.description = journalEntryToUpdate.description;

    await this.journalEntryRepository.save(foundJournalEntry);

    return;
  }
  private checkDoesUserHaveAtLeastOneEntry(allJournalEntries: JournalEntry[]) {
    if (!allJournalEntries?.length) {
      throw new ForbiddenException("You don't have any journal entries!");
    }
  }

  private async findJournalEntry(
    allJournalEntries: JournalEntry[],
    journalEntryToUpdate: DeleteJournalEntryDto,
  ) {
    const foundJournalEntry = allJournalEntries.find(
      (je) => je.id == journalEntryToUpdate.id,
    );
    if (!foundJournalEntry) throw new BadRequestException('Invalid ID!');
    return foundJournalEntry;
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
    this.checkDoesUserHaveAtLeastOneEntry(user.journalEntries);

    return user.journalEntries;
  }

  async getJournalEntryById(
    journalEntries: JournalEntry[],
    id: number,
  ): Promise<JournalEntry> {
    if (!journalEntries?.length || !id) {
      throw new InternalServerErrorException('Journal entry not found');
    }

    const foundEntry = journalEntries.find((en) => en.id == id);

    if (!foundEntry) {
      throw new InternalServerErrorException('Journal entry not found!');
    }

    return foundEntry;
  }

  constructor(
    @InjectRepository(JournalEntry)
    private journalEntryRepository: Repository<JournalEntry>,
    private virtualTimeService: VirtualTimeService,
  ) {}
  async createJournalEntry(
    user: User,
    title: string,
    description: string,
  ): Promise<JournalEntry> {
    await this.canNewJournalEntryBeCreated(user);
    const journalEntry: JournalEntry = new JournalEntry();
    journalEntry.dateAdded = await this.virtualTimeService.getTime();
    journalEntry.description = description;
    journalEntry.title = title;
    journalEntry.username = user.username;

    await this.journalEntryRepository.save(journalEntry);

    return journalEntry;
  }

  private async canNewJournalEntryBeCreated(user: User): Promise<void> {
    const hasAtLeastOneJournalEntry = user.journalEntries?.length > 0;
    if (hasAtLeastOneJournalEntry) {
      const currentDate = await this.virtualTimeService.getTime();
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
