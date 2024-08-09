import { Exclude, Type } from 'class-transformer';
import { NutritionixInstantEndpointFoodPhotoDto } from '../nutritionix-instant-endpoint-food-photo-dto/nutritionix-instant-endpoint-food-photo-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from '../nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';

export class NutritionixCommonAndBrandedFoodDetailsResponseDto {
  @Type(() => NutritionixCommonAndBrandedFoodDetailsDto)
  foods: NutritionixCommonAndBrandedFoodDetailsDto[];
}
