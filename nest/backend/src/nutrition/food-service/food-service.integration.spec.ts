import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food-service';
import { InternalServerErrorException } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Food } from '../../entities/food/food';
import { UserFood } from '../../entities/user_food/user_food';
import { User } from '../../entities/user/user';
import { NutritionixCommonAndBrandedFoodDetailsDto } from '../../dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';
import { Repository } from 'typeorm';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { Exercise } from '../..//entities/exercise/exercise';

describe('FoodService (integration tests)', () => {
  let provider: FoodService;
  let foodRepo: Repository<Food>;
  let userRepo: Repository<User>;
  const food = new Food();
  const foodName = 'hamburger';
  food.name = foodName;
  food.nixId = '123';
  food.userFoods = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [
            JournalEntry,
            User,
            Bmientry,
            WorkoutPlan,
            Exercise,
            Food,
            UserFood,
          ],
        }),
        TypeOrmModule.forFeature([
          JournalEntry,
          User,
          Bmientry,
          WorkoutPlan,
          Exercise,
          Food,
          UserFood,
        ]),
      ],
      providers: [FoodService],
    }).compile();
    foodRepo = module.get<Repository<Food>>(getRepositoryToken(Food));
    const foodDb = await foodRepo.findOne({
      where: { name: foodName },
      relations: ['userFoods'],
    });
    if (foodDb) {
      await foodRepo.remove(foodDb);
    }
    provider = module.get<FoodService>(FoodService);
  });

  describe('getFoodByNixId', () => {
    it('should return null if food with matching id not found', async () => {
      const result = await provider.getFoodByNixId('-1');

      expect(result).toStrictEqual(null);
    });

    it('should return food if food with matching id is found', async () => {
      await foodRepo.save(food);
      const result = await provider.getFoodByNixId(food.nixId);

      expect(result.nixId).toStrictEqual(food.nixId);
    });
  });

  describe('createFood', () => {
    it('should return food if nix id passed', async () => {
      const details = new NutritionixCommonAndBrandedFoodDetailsDto();
      details.food_name = 'hamburger';
      details.nf_calories = 0.3;
      details.nf_potassium = 0.1;
      details.nf_cholesterol = 0.2;
      details.nf_dietary_fiber = 0.1;
      details.nf_protein = 0.1;
      details.nf_saturated_fat = 0.1;
      details.nf_sodium = 0.1;
      details.nf_sugars = 0.1;
      details.nf_total_carbohydrate = 0.2;
      details.nf_total_fat = 0.01;
      details.nix_item_id = '1';
      const result = await provider.createFood(details);

      expect(result).toBeDefined();
      expect(result.calories).toStrictEqual(details.nf_calories);
      expect(result.potassium).toStrictEqual(details.nf_potassium);
      expect(result.cholesterol).toStrictEqual(details.nf_cholesterol);
      expect(result.dietery_fiber).toStrictEqual(details.nf_dietary_fiber);
      expect(result.protein).toStrictEqual(details.nf_protein);
      expect(result.saturated_fat).toStrictEqual(details.nf_saturated_fat);
      expect(result.sodium).toStrictEqual(details.nf_sodium);
      expect(result.sugars).toStrictEqual(details.nf_sugars);
      expect(result.total_carbohydrate).toStrictEqual(
        details.nf_total_carbohydrate,
      );
      expect(result.total_fat).toStrictEqual(details.nf_total_fat);
      expect(result.nixId).toStrictEqual(details.nix_item_id);
    });

    it('should return food if nix id not passed', async () => {
      const details = new NutritionixCommonAndBrandedFoodDetailsDto();
      details.food_name = 'hamburger';
      details.nf_calories = 0.3;
      details.nf_potassium = 0.1;
      details.nf_cholesterol = 0.2;
      details.nf_dietary_fiber = 0.1;
      details.nf_protein = 0.1;
      details.nf_saturated_fat = 0.1;
      details.nf_sodium = 0.1;
      details.nf_sugars = 0.1;
      details.nf_total_carbohydrate = 0.2;
      details.nf_total_fat = 0.01;
      const result = await provider.createFood(details);

      expect(result).toBeDefined();
      expect(result.calories).toStrictEqual(details.nf_calories);
      expect(result.potassium).toStrictEqual(details.nf_potassium);
      expect(result.cholesterol).toStrictEqual(details.nf_cholesterol);
      expect(result.dietery_fiber).toStrictEqual(details.nf_dietary_fiber);
      expect(result.protein).toStrictEqual(details.nf_protein);
      expect(result.saturated_fat).toStrictEqual(details.nf_saturated_fat);
      expect(result.sodium).toStrictEqual(details.nf_sodium);
      expect(result.sugars).toStrictEqual(details.nf_sugars);
      expect(result.total_carbohydrate).toStrictEqual(
        details.nf_total_carbohydrate,
      );
      expect(result.total_fat).toStrictEqual(details.nf_total_fat);
    });
  });

  describe('getFoodByName', () => {
    it('should return null if food by name not found', async () => {
      const result = await provider.getFoodByName(foodName);

      expect(result).toBeNull();
    });

    it('should return common food entity that has matching name', async () => {
      const foodDb = await foodRepo.save(food);
      const result = await provider.getFoodByName(foodName);

      expect(result).toStrictEqual(foodDb);
    });
  });
});
