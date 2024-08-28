interface IAddFoodId {
  name?: never;
  id: string;
}

interface IAddFoodName {
  name: string;
  id?: never;
}

export type IAddFoodToNutrition = IAddFoodId | IAddFoodName;
