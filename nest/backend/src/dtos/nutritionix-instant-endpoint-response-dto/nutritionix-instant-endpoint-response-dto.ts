import { Type } from 'class-transformer';
import { NutritionixInstantEndpointCommonFoodDto } from '../nutritionix-instant-endpoint-food-dto/nutritionix-instant-endpoint-common-food-dto';
import { NutritionixInstantEndpointBrandedFoodDto } from '../nutritionix-instant-endpoint-branded-food-dto/nutritionix-instant-endpoint-branded-food-dto';

export class NutritionixInstantEndpointResponseDto {
  @Type(() => NutritionixInstantEndpointCommonFoodDto)
  common: NutritionixInstantEndpointCommonFoodDto[];

  @Type(() => NutritionixInstantEndpointBrandedFoodDto)
  branded: NutritionixInstantEndpointBrandedFoodDto[];
}
