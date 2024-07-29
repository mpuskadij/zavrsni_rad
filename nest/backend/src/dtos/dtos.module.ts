import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';
import { EntitiesModule } from '../entities/entities.module';
import { Bmientry } from '../entities/bmientry/bmientry';
import { JournalEntryDto } from './journal-entry-dto/journal-entry-dto';

@Module({
  imports: [EntitiesModule],
  exports: [BmiEntryDto, JournalEntryDto],
  providers: [BmiEntryDto, Bmientry, JournalEntryDto],
})
export class DtosModule {}
