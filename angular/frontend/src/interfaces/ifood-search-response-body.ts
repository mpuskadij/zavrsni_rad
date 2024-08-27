import { IBrandedFood } from './ibranded-food';
import { ICommonFood } from './icommon-food';

export interface IFoodSearchResponseBody {
  common: ICommonFood[];

  branded: IBrandedFood[];
}
