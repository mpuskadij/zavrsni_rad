import { Exclude, Expose, Type } from 'class-transformer';
import { NutritionixInstantEndpointFoodPhotoDto } from '../nutritionix-instant-endpoint-food-photo-dto/nutritionix-instant-endpoint-food-photo-dto';

export class NutritionixInstantEndpointCommonFoodDto {
  food_name: string;

  serving_unit: string;

  tag_name: string;

  serving_qty: number;

  @Exclude()
  common_type: null;

  tag_id: string;

  @Type(() => NutritionixInstantEndpointFoodPhotoDto)
  photo: NutritionixInstantEndpointFoodPhotoDto;

  @Exclude()
  locale: string;
}
