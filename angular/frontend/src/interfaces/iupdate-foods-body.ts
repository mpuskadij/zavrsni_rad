import { INutritionFood } from './inutrition-food';
import { IUpdateFoodDetails } from './iupdate-food-details';

export interface IUpdateFoodsBody {
  foods: IUpdateFoodDetails[];
}
