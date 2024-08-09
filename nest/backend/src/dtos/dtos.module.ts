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
import { WgerVariatonDto } from './wger-variaton-dto/wger-variaton-dto';
import { WgerMuscleDto } from './wger-muscle-dto/wger-muscle-dto';
import { WgerCategoryResponseDto } from './wger-category-response-dto/wger-category-response-dto';
import { WgerEquipmentResponseDto } from './wger-equipment-response-dto/wger-equipment-response-dto';
import { WgerExerciseDto } from './wger-exercise-dto/wger-exercise-dto';
import { NutritionixInstantEndpointBrandedFoodDto } from './nutritionix-instant-endpoint-branded-food-dto/nutritionix-instant-endpoint-branded-food-dto';
import { NutritionixInstantEndpointCommonFoodDto } from './nutritionix-instant-endpoint-food-dto/nutritionix-instant-endpoint-common-food-dto';
import { NutritionixInstantEndpointFoodPhotoDto } from './nutritionix-instant-endpoint-food-photo-dto/nutritionix-instant-endpoint-food-photo-dto';
import { NutritionixInstantEndpointResponseDto } from './nutritionix-instant-endpoint-response-dto/nutritionix-instant-endpoint-response-dto';
import { SearchFoodDto } from './search-food-dto/search-food-dto';
import { NutritionixCommonAndBrandedFoodDetailsResponseDto } from './nutritionix-common-and-branded-food-details-response-dto/nutritionix-common-and-branded-food-details-response-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from './nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';

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
    WgerEquipmentResponseDto,
    NutritionixInstantEndpointBrandedFoodDto,
    NutritionixInstantEndpointCommonFoodDto,
    NutritionixInstantEndpointFoodPhotoDto,
    NutritionixInstantEndpointResponseDto,
    SearchFoodDto,
    NutritionixCommonAndBrandedFoodDetailsResponseDto,
    NutritionixCommonAndBrandedFoodDetailsDto,
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
    WgerEquipmentResponseDto,
    NutritionixInstantEndpointBrandedFoodDto,
    NutritionixInstantEndpointCommonFoodDto,
    NutritionixInstantEndpointFoodPhotoDto,
    NutritionixInstantEndpointResponseDto,
    SearchFoodDto,
    NutritionixCommonAndBrandedFoodDetailsResponseDto,
    NutritionixCommonAndBrandedFoodDetailsDto,
  ],
})
export class DtosModule {}
