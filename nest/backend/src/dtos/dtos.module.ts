import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';
import { EntitiesModule } from '../entities/entities.module';
import { Bmientry } from '../entities/bmientry/bmientry';
import { JournalEntryDto } from './journal-entry-dto/journal-entry-dto';
import { DeleteJournalEntryDto } from './journal-entry-dto/delete-journal-entry-dto';
import { SearchExerciseDto } from './search-exercise-dto/search-exercise-dto';
import { WgerExerciseResultDto } from './wger-exercise-result-dto/wger-exercise-result-dto';

@Module({
  imports: [EntitiesModule],
  exports: [
    BmiEntryDto,
    JournalEntryDto,
    DeleteJournalEntryDto,
    SearchExerciseDto,
    WgerExerciseResultDto,
  ],
  providers: [
    BmiEntryDto,
    Bmientry,
    JournalEntryDto,
    DeleteJournalEntryDto,
    SearchExerciseDto,
    WgerExerciseResultDto,
  ],
})
export class DtosModule {}
