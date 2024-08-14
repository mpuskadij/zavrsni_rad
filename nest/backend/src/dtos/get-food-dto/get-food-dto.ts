import { Exclude } from 'class-transformer';

export class GetFoodDto {
  id: number;

  name: string;

  @Exclude()
  tagId: string;

  @Exclude()
  nixId: string;

  calories?: number;

  total_fat?: number;

  saturated_fat?: number;

  cholesterol?: number;

  sodium?: number;

  total_carbohydrate?: number;

  dietery_fiber?: number;

  sugars?: number;

  protein?: number;

  potassium?: number;

  @Exclude()
  userFoods: [];
}
