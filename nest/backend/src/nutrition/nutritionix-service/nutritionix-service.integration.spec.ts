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

describe('NutritionixService', () => {
  let provider: NutritionixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DtosModule],
      providers: [NutritionixService],
    }).compile();

    provider = module.get<NutritionixService>(NutritionixService);
  });

  describe.skip('searchForFood', () => {
    it('should return branded and common foods that match search term if nutritionix returns 200 OK', async () => {
      const result = await provider.searchForFood('hamburger');

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(NutritionixInstantEndpointResponseDto);
      expect(result.branded).toBeDefined();
      expect(result.common).toBeDefined();
      expect(result.branded.length).toBeGreaterThan(0);
      expect(result.common.length).toBeGreaterThan(0);
    });
  });

  describe.skip('getCommonFoodItemDetails', () => {
    it('should return details of common food item that exists in Nutritionix', async () => {
      const result = await provider.getCommonFoodItemDetails('hamburger');

      expect(result).toBeDefined();
      expect(result.food_name).toBe('hamburger');
    });
  });

  describe.skip('getBrandedFoodItemDetails', () => {
    it('should return details of branded food item that exists in Nutritionix', async () => {
      const result = await provider.getBrandedFoodItemDetails(
        '51c549ff97c3e6efadd60294',
      );

      expect(result).toBeDefined();
      expect(result.food_name).toBe(
        'Coffee Creamer, Italian Sweet Creme, Zero Sugar',
      );
    });
  });
});
