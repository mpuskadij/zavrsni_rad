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
import { NutritionixCommonAndBrandedFoodDetailsResponseDto } from '../../dtos/nutritionix-common-and-branded-food-details-response-dto/nutritionix-common-and-branded-food-details-response-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from '../../dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';
import { NutritionixInstantEndpointBrandedFoodDto } from '../../dtos/nutritionix-instant-endpoint-branded-food-dto/nutritionix-instant-endpoint-branded-food-dto';

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
      foodFromNutritionix.branded = [
        new NutritionixInstantEndpointBrandedFoodDto(),
      ];
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

    it('should throw exception if no food items found', async () => {
      const nutritionixResponseBody =
        new NutritionixCommonAndBrandedFoodDetailsResponseDto();
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(nutritionixResponseBody),
      });

      const result = () => provider.searchForFood('asdasfasf');

      expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCommonFoodItemDetails', () => {
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
        new NutritionixCommonAndBrandedFoodDetailsResponseDto();
      const foods = new NutritionixCommonAndBrandedFoodDetailsDto();
      nutritionixResponseBody.foods = [foods];
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(nutritionixResponseBody),
      });
      const result = await provider.getCommonFoodItemDetails('hamburger');

      expect(result).toStrictEqual(foods);
    });
  });

  describe('getBrandedFoodItemDetails', () => {
    it('should throw exception if id of branded food item is falsy', async () => {
      const result = () => provider.getBrandedFoodItemDetails('');

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw exception if Nutritionix sent 404 (id is invalid)', async () => {
      mockFetch.mockResolvedValue({ ok: false });
      const result = () => provider.getBrandedFoodItemDetails('daklsjdlaksf');

      expect(result).rejects.toThrow(ServiceUnavailableException);
    });

    it('should throw exception if response body doesnt contain details', async () => {
      const nutritionixResponseBody =
        new NutritionixCommonAndBrandedFoodDetailsResponseDto();
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(nutritionixResponseBody),
      });

      const result = () =>
        provider.getBrandedFoodItemDetails('51c549ff97c3e6efadd60294');

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return details if details found from Nutritionix', async () => {
      const coffee = new NutritionixCommonAndBrandedFoodDetailsDto();
      coffee.brand_name = 'Franck';
      coffee.food_name = 'Coffee';
      const nutritionixResponseBody =
        new NutritionixCommonAndBrandedFoodDetailsResponseDto();
      nutritionixResponseBody.foods = [coffee];
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(nutritionixResponseBody),
      });

      const result = await provider.getBrandedFoodItemDetails(
        '51c549ff97c3e6efadd60294',
      );

      expect(result).toEqual(coffee);
    });
  });
});
