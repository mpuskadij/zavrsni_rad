import { Exclude, Type } from 'class-transformer';
import { NutritionixInstantEndpointFoodPhotoDto } from '../nutritionix-instant-endpoint-food-photo-dto/nutritionix-instant-endpoint-food-photo-dto';
import { NutritionixNaturalLanguageNutrientsDetailsDto } from '../nutritionix-natural-language-nutrients-details-dto/nutritionix-natural-language-nutrients-details-dto';

export class NutritionixNaturalLanguageNutrientsResponseDto {
  foods: NutritionixNaturalLanguageNutrientsDetailsDto[];
}
