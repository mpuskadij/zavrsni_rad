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
  });
});
