import { IPhoto } from './iphoto';

export interface IBrandedFood {
  food_name: string;

  serving_unit: string;

  serving_qty: number;

  brand_name_item_name: string;

  nf_calories: number;

  brand_name: string;

  photo: IPhoto;

  nix_item_id: string;
}
