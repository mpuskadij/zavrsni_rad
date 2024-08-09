import { Exclude, Expose, Type } from 'class-transformer';
import { NutritionixInstantEndpointFoodPhotoDto } from '../nutritionix-instant-endpoint-food-photo-dto/nutritionix-instant-endpoint-food-photo-dto';

export class NutritionixCommonAndBrandedFoodDetailsDto {
  food_name: string;

  brand_name: string;

  serving_qty: number;

  serving_unit: string;

  serving_weight_grams: number;

  @Expose({ groups: ['branded'] })
  nf_metric_qty: number;

  @Expose({ groups: ['branded'] })
  nf_metric_uom: string;

  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietery_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
  nf_p: number;

  @Exclude()
  full_nutrients: [];

  @Exclude()
  nix_brand_name: string;

  @Exclude()
  nix_brand_id: string;

  @Exclude()
  nix_item_name: string;

  @Exclude()
  nix_item_id: string;

  upc: string;

  @Exclude()
  consumed_at: string;

  metadata: { is_raw_food: boolean };

  @Exclude()
  source: number;

  @Exclude()
  ndb_no: number;

  @Exclude()
  tags: [];

  @Exclude()
  alt_measures: [];

  @Exclude()
  lat: string;

  @Exclude()
  lng: string;

  @Exclude()
  meal_type: string;

  @Type(() => NutritionixInstantEndpointFoodPhotoDto)
  photo: NutritionixInstantEndpointFoodPhotoDto;

  @Exclude()
  sub_recipe: string;

  @Exclude()
  note: string;

  @Exclude()
  class_code: string;

  @Exclude()
  brick_code: string;

  @Exclude()
  tag_id: string;

  @Expose({ groups: ['branded'] })
  nf_ingredient_statement: string;
}
