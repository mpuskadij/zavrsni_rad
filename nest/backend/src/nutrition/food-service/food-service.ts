import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from '../../entities/food/food';
import { Repository } from 'typeorm';
import { UserFood } from 'src/entities/user_food/user_food';
import { NutritionixCommonAndBrandedFoodDetailsDto } from 'src/dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';

@Injectable()
export class FoodService {
  async getFoodByName(foodName: string): Promise<Food> {
    if (!foodName) {
      throw new InternalServerErrorException(
        'Server had trouble checking if food already in nutrition!',
      );
    }
    const foodFromDatabase = await this.foodRepository.findOne({
      where: { name: foodName },
      relations: ['userFoods'],
    });
    return foodFromDatabase;
  }
  async createFood(
    details: NutritionixCommonAndBrandedFoodDetailsDto,
  ): Promise<Food> {
    const food = new Food();
    food.name = details.food_name;
    food.calories = details.nf_calories ?? null;
    food.cholesterol = details.nf_cholesterol ?? null;
    food.dietery_fiber = details.nf_dietery_fiber ?? null;
    food.nixId = details.nix_item_id ?? null;
    food.potassium = details.nf_potassium ?? null;
    food.protein = details.nf_protein ?? null;
    food.saturated_fat = details.nf_saturated_fat ?? null;
    food.total_fat = details.nf_total_fat ?? null;
    food.total_carbohydrate = details.nf_total_carbohydrate ?? null;
    food.sodium = details.nf_sodium ?? null;
    food.sugars = details.nf_sugars ?? null;
    food.userFoods = [];
    return await this.foodRepository.save(food);
  }
  async assignUser(food: Food, userFood: UserFood): Promise<void> {
    if (!food || !userFood) {
      throw new InternalServerErrorException(
        'Server had trouble adding food to nutrition!',
      );
    }
    food.userFoods.push(userFood);

    await this.foodRepository.save(food);

    return;
  }
  constructor(
    @InjectRepository(Food) private foodRepository: Repository<Food>,
  ) {}

  async getFoodByNixId(id: string): Promise<Food> {
    if (!id) {
      throw new InternalServerErrorException(
        'Server had trouble finding the food item!',
      );
    }
    return await this.foodRepository.findOne({
      where: { nixId: id },
      relations: ['userFoods'],
    });
  }
}
