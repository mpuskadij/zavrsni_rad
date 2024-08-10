import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food-service';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Food } from '../../entities/food/food';
import { UserFood } from '../../entities/user_food/user_food';
import { User } from '../../entities/user/user';
import { NutritionixCommonAndBrandedFoodDetailsDto } from '../../dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';

describe('FoodService (unit tests)', () => {
  let provider: FoodService;
  let mockFoodRepository = { findOne: jest.fn(), save: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        { provide: getRepositoryToken(Food), useValue: mockFoodRepository },
      ],
    }).compile();

    provider = module.get<FoodService>(FoodService);
  });

  describe('getFoodByParameter', () => {
    it('should throw error if nix id undefined', async () => {
      const result = () => provider.getFoodByNixId(undefined);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return null if food with matching id not found', async () => {
      mockFoodRepository.findOne.mockResolvedValue(null);
      const result = await provider.getFoodByNixId('3');

      expect(result).toStrictEqual(null);
    });

    it('should return food if food with matching id is found', async () => {
      const food = new Food();
      mockFoodRepository.findOne.mockResolvedValue(food);
      const result = await provider.getFoodByNixId('3');

      expect(result).toStrictEqual(food);
    });
  });

  describe('assignUser', () => {
    it('should throw exception if food is falsy', async () => {
      const result = () => provider.assignUser(null, new UserFood());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if food is falsy', async () => {
      const result = () => provider.assignUser(new Food(), null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should assign food if parameters are not falsy', async () => {
      const food = new Food();
      food.userFoods = [];
      mockFoodRepository.save.mockResolvedValue(food);
      await provider.assignUser(food, new UserFood());

      expect(food.userFoods).toHaveLength(1);
    });
  });

  describe('createFood', () => {
    it('should throw exception if both tag id and nix item id missing', async () => {
      const details = new NutritionixCommonAndBrandedFoodDetailsDto();
      details.food_name = 'hamburger';
      details.nf_calories = 0.3;
      details.nf_potassium = 0.1;
      details.nf_cholesterol = 0.2;
      details.nf_dietery_fiber = 0.1;
      details.nf_protein = 0.1;
      details.nf_saturated_fat = 0.1;
      details.nf_sodium = 0.1;
      details.nf_sugars = 0.1;
      details.nf_total_carbohydrate = 0.2;
      details.nf_total_fat = 0.01;

      const result = () => provider.createFood(details);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return food if nix id passed', async () => {
      const details = new NutritionixCommonAndBrandedFoodDetailsDto();
      details.food_name = 'hamburger';
      details.nf_calories = 0.3;
      details.nf_potassium = 0.1;
      details.nf_cholesterol = 0.2;
      details.nf_dietery_fiber = 0.1;
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
      expect(result.dietery_fiber).toStrictEqual(details.nf_dietery_fiber);
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

    it('should return food if tag id passed', async () => {
      const details = new NutritionixCommonAndBrandedFoodDetailsDto();
      details.food_name = 'hamburger';
      details.nf_calories = 0.3;
      details.nf_potassium = 0.1;
      details.nf_cholesterol = 0.2;
      details.nf_dietery_fiber = 0.1;
      details.nf_protein = 0.1;
      details.nf_saturated_fat = 0.1;
      details.nf_sodium = 0.1;
      details.nf_sugars = 0.1;
      details.nf_total_carbohydrate = 0.2;
      details.nf_total_fat = 0.01;
      details.tag_id = '1';

      const result = await provider.createFood(details);

      expect(result).toBeDefined();
      expect(result.calories).toStrictEqual(details.nf_calories);
      expect(result.potassium).toStrictEqual(details.nf_potassium);
      expect(result.cholesterol).toStrictEqual(details.nf_cholesterol);
      expect(result.dietery_fiber).toStrictEqual(details.nf_dietery_fiber);
      expect(result.protein).toStrictEqual(details.nf_protein);
      expect(result.saturated_fat).toStrictEqual(details.nf_saturated_fat);
      expect(result.sodium).toStrictEqual(details.nf_sodium);
      expect(result.sugars).toStrictEqual(details.nf_sugars);
      expect(result.total_carbohydrate).toStrictEqual(
        details.nf_total_carbohydrate,
      );
      expect(result.total_fat).toStrictEqual(details.nf_total_fat);
      expect(result.tagId).toStrictEqual(details.tag_id);
    });

    it('should throw exception if both tag id and nix id passed', async () => {
      const details = new NutritionixCommonAndBrandedFoodDetailsDto();
      details.food_name = 'hamburger';
      details.nf_calories = 0.3;
      details.nf_potassium = 0.1;
      details.nf_cholesterol = 0.2;
      details.nf_dietery_fiber = 0.1;
      details.nf_protein = 0.1;
      details.nf_saturated_fat = 0.1;
      details.nf_sodium = 0.1;
      details.nf_sugars = 0.1;
      details.nf_total_carbohydrate = 0.2;
      details.nf_total_fat = 0.01;
      details.tag_id = '1';
      details.nix_item_id = '123';

      const result = () => provider.createFood(details);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });
});
