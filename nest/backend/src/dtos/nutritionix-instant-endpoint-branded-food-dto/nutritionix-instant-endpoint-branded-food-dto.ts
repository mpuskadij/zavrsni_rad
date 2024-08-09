import { Exclude, Type } from 'class-transformer';
import { NutritionixInstantEndpointFoodPhotoDto } from '../nutritionix-instant-endpoint-food-photo-dto/nutritionix-instant-endpoint-food-photo-dto';
import { PickType } from '@nestjs/mapped-types';
import { NutritionixInstantEndpointCommonFoodDto } from '../nutritionix-instant-endpoint-food-dto/nutritionix-instant-endpoint-common-food-dto';

export class NutritionixInstantEndpointBrandedFoodDto extends PickType(
  NutritionixInstantEndpointCommonFoodDto,
  ['food_name', 'photo', 'serving_unit', 'serving_qty', 'locale'] as const,
) {
  @Exclude()
  nix_brand_id: string;

  brand_name_item_name: string;

  nf_calories: number;

  brand_name: string;

  @Exclude()
  region: number;

  @Exclude()
  brand_type: number;

  nix_item_id: string;
}
