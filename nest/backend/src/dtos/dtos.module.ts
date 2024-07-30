import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';
import { EntitiesModule } from '../entities/entities.module';
import { Bmientry } from '../entities/bmientry/bmientry';
import { JournalEntryDto } from './journal-entry-dto/journal-entry-dto';
import { DeleteJournalEntryDto } from './journal-entry-dto/delete-journal-entry-dto';
import { SearchExerciseDto } from './search-exercise-dto/search-exercise-dto';

@Module({
  imports: [EntitiesModule],
  exports: [
    BmiEntryDto,
    JournalEntryDto,
    DeleteJournalEntryDto,
    SearchExerciseDto,
  ],
  providers: [
    BmiEntryDto,
    Bmientry,
    JournalEntryDto,
    DeleteJournalEntryDto,
    SearchExerciseDto,
  ],
})
export class DtosModule {}
