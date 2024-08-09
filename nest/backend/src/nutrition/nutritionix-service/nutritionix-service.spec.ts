import { Test, TestingModule } from '@nestjs/testing';
import { NutritionixService } from './nutritionix-service';
import {
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DtosModule } from '../../dtos/dtos.module';
import { NutritionixInstantEndpointResponseDto } from '../../dtos/nutritionix-instant-endpoint-response-dto/nutritionix-instant-endpoint-response-dto';
import { NutritionixInstantEndpointCommonFoodDto } from '../../dtos/nutritionix-instant-endpoint-food-dto/nutritionix-instant-endpoint-common-food-dto';
import { NutritionixNaturalLanguageNutrientsResponseDto } from '../../dtos/nutritionix-natural-language-nutrients-response-dto/nutritionix-natural-language-nutrients-response-dto';
import { NutritionixNaturalLanguageNutrientsDetailsDto } from '../../dtos/nutritionix-natural-language-nutrients-details-dto/nutritionix-natural-language-nutrients-details-dto';

describe('NutritionixService', () => {
  let provider: NutritionixService;
  const mockFetch = jest.fn();
  global.fetch = mockFetch as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DtosModule],
      providers: [NutritionixService],
    }).compile();

    provider = module.get<NutritionixService>(NutritionixService);
  });

  describe('searchForFood', () => {
    it('should throw BadRequestExcception if search string is falsy', async () => {
      const result = () => provider.searchForFood('');

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw ServiceUnavailable if nutritionix doesnt return 200 OK', async () => {
      const result = () => provider.searchForFood('hamburger');
      mockFetch.mockResolvedValue({ ok: false });

      expect(result).rejects.toThrow(ServiceUnavailableException);
    });

    it('should return branded and common foods that match search term if nutritionix returns 200 OK', async () => {
      const foodFromNutritionix = new NutritionixInstantEndpointResponseDto();
      const mockResponse = {
        ok: true,
        text: async () => JSON.stringify(foodFromNutritionix),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await provider.searchForFood('hamburger');

      expect(result).toStrictEqual(foodFromNutritionix);
    });

    it('should filter common foods that have the same tag_id', async () => {
      const foodFromNutritionix = new NutritionixInstantEndpointResponseDto();
      const hamburger = new NutritionixInstantEndpointCommonFoodDto();
      hamburger.tag_id = '1';
      hamburger.food_name = 'hamburger';

      const hamburgers = new NutritionixInstantEndpointCommonFoodDto();
      hamburgers.tag_id = '1';
      hamburgers.food_name = 'hamburgers';

      foodFromNutritionix.common = [hamburger, hamburgers];

      const mockResponse = {
        ok: true,
        text: async () => JSON.stringify(foodFromNutritionix),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await provider.searchForFood('hamburger');

      expect(result.common).toHaveLength(1);
    });
  });

  describe('getFoodItemDetails', () => {
    it('should throw exception if the name of the food item is falsy', async () => {
      const result = () => provider.getCommonFoodItemDetails('');

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw exception if Nutritionix did not send 200 OK response', async () => {
      mockFetch.mockResolvedValue({ ok: false });
      const result = () => provider.getCommonFoodItemDetails('hamburger');

      expect(result).rejects.toThrow(ServiceUnavailableException);
    });

    it('should return nutrients for food if Nutritionix returns 200 OK', async () => {
      const nutritionixResponseBody =
        new NutritionixNaturalLanguageNutrientsResponseDto();
      const foods = new NutritionixNaturalLanguageNutrientsDetailsDto();
      nutritionixResponseBody.foods = [foods];
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(nutritionixResponseBody),
      });
      const result = await provider.getCommonFoodItemDetails('hamburger');

      expect(result).toStrictEqual(foods);
    });

    it('should throw exception if food details not found', async () => {
      const nutritionixResponseBody =
        new NutritionixNaturalLanguageNutrientsResponseDto();
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(nutritionixResponseBody),
      });
      const result = () => provider.getCommonFoodItemDetails('hamburger');

      expect(result).rejects.toThrow(BadRequestException);
    });
  });
});
