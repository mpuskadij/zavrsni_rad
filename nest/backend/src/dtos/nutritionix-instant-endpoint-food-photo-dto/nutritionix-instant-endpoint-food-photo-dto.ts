import { Exclude } from 'class-transformer';

export class NutritionixInstantEndpointFoodPhotoDto {
  thumb: string;

  @Exclude()
  highres: string;

  @Exclude()
  is_user_uploaded: boolean;
}
