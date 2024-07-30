import { PickType } from '@nestjs/mapped-types';
import { JournalEntryDto } from './journal-entry-dto';

export class DeleteJournalEntryDto extends PickType(JournalEntryDto, [
  'dateAdded',
] as const) {}
