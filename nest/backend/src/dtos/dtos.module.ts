import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';
import { EntitiesModule } from '../entities/entities.module';
import { Bmientry } from '../entities/bmientry/bmientry';
import { JournalEntryDto } from './journal-entry-dto/journal-entry-dto';
import { DeleteJournalEntryDto } from './journal-entry-dto/delete-journal-entry-dto';

@Module({
  imports: [EntitiesModule],
  exports: [BmiEntryDto, JournalEntryDto, DeleteJournalEntryDto],
  providers: [BmiEntryDto, Bmientry, JournalEntryDto, DeleteJournalEntryDto],
})
export class DtosModule {}
