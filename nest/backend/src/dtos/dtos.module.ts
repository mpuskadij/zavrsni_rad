import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';
import { EntitiesModule } from '../entities/entities.module';
import { Bmientry } from '../entities/bmientry/bmientry';
import { JournalEntryDto } from './journal-entry-dto/journal-entry-dto';
import { DeleteJournalEntryDto } from './journal-entry-dto/delete-journal-entry-dto';
import { SearchExerciseDto } from './search-exercise-dto/search-exercise-dto';
import { WgerExerciseResultDto } from './wger-exercise-result-dto/wger-exercise-result-dto';
import { WgerCategoryDto } from './wger-category-dto/wger-category-dto';
import { WgerEquipmentDto } from './wger-equipment-dto/wger-equipment-dto';
import {
  WgerExerciseDto,
  WgerVariatonDto,
} from './wger-variaton-dto/wger-variaton-dto';
import { WgerMuscleDto } from './wger-muscle-dto/wger-muscle-dto';
import { WgerCategoryResponseDto } from './wger-category-response-dto/wger-category-response-dto';

@Module({
  imports: [EntitiesModule],
  exports: [
    BmiEntryDto,
    JournalEntryDto,
    DeleteJournalEntryDto,
    SearchExerciseDto,
    WgerExerciseResultDto,
    WgerCategoryDto,
    WgerEquipmentDto,
    WgerExerciseDto,
    WgerMuscleDto,
    WgerVariatonDto,
    WgerCategoryResponseDto,
  ],
  providers: [
    BmiEntryDto,
    Bmientry,
    JournalEntryDto,
    DeleteJournalEntryDto,
    SearchExerciseDto,
    WgerExerciseResultDto,
    WgerCategoryDto,
    WgerEquipmentDto,
    WgerExerciseDto,
    WgerMuscleDto,
    WgerVariatonDto,
    WgerCategoryResponseDto,
  ],
})
export class DtosModule {}
