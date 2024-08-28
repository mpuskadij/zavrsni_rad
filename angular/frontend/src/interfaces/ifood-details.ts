import { IMetadata } from './imetadata';

export interface IFoodDetails {
  food_name: string;
  brand_name: string;

  serving_unit: string;

  serving_weight_grams: number;

  nf_metric_qty?: number;

  nf_metric_uom?: string;

  nf_calories: number;
  nf_total_fat: number;
  nf_saturated_fat: number;
  nf_cholesterol: number;
  nf_sodium: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_protein: number;
  nf_potassium: number;
  nf_p: number;

  metadata: IMetadata;

  tag_id?: string;

  nix_item_id?: string;

  nf_ingredient_statement?: string;
}
