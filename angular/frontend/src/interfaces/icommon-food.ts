import { IPhoto } from './iphoto';

export interface ICommonFood {
  food_name: string;

  serving_unit: string;

  tag_name: string;

  serving_qty: number;

  tag_id: string;

  photo: IPhoto;
}
