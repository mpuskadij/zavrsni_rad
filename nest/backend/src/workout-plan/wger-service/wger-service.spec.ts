import { Test, TestingModule } from '@nestjs/testing';
import { WgerService } from './wger-service';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { DtosModule } from '../../dtos/dtos.module';
import { WgerExerciseDto } from '../../dtos/wger-variaton-dto/wger-variaton-dto';
import { WgerCategoryResponseDto } from 'src/dtos/wger-category-response-dto/wger-category-response-dto';
import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { WgerCategoryDto } from 'src/dtos/wger-category-dto/wger-category-dto';

describe('WgerService (unit tests)', () => {
  let provider: WgerService;
  const mockFetch = jest.fn();
  global.fetch = mockFetch as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DtosModule],
      providers: [WgerService],
    }).compile();

    provider = module.get<WgerService>(WgerService);
  });

  describe('getExerciseBySearchTerm', () => {
    const searchTerm = '2 Handed Kettlebell Swing';

    it('should throw BadRequestException if page is not a number', async () => {
      await expect(provider.getExercisesBySearchTerm(null)).rejects.toThrow(
        'Page must be a number',
      );
    });

    it('should throw ServiceUnavailable if Wger returns status different than 200', async () => {
      const incorrectTerm = 'asdlksjdgj';
      mockFetch.mockResolvedValue({ ok: false });
      await expect(
        provider.getExercisesBySearchTerm(1, incorrectTerm),
      ).rejects.toThrow('Error while communnicating with external API!');
    });

    it('should throw BadRequestException if Wger returns 0 exercises', async () => {
      const incorrectTerm = 'asdlksjdgj';
      const wgerResponse: WgerExerciseResultDto = {
        count: 0,
        results: [],
        previous: null,
        next: null,
      };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      await expect(
        provider.getExercisesBySearchTerm(1, incorrectTerm),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return matching exercises if search term not empty and exercises are found', async () => {
      const wgerResponse: WgerExerciseResultDto = {
        count: 1,
        results: [null],
        previous: null,
        next: null,
      };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      const result = await provider.getExercisesBySearchTerm(1, searchTerm);

      expect(result).toBeInstanceOf(Array<WgerExerciseDto>);
    });
  });

  describe('getCategories', () => {
    const wgerResponse: WgerCategoryResponseDto = {
      count: 8,
      next: null,
      previous: null,
      results: [],
    };

    it('should throw ServiceUnavailableException if Wger returns response different than 200 OK', async () => {
      mockFetch.mockResolvedValue({ ok: false });
      await expect(provider.getCategories()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should return array of categories if no parameters passed', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      const result: WgerCategoryDto[] = await provider.getCategories();
      expect(result).toBeInstanceOf(Array<WgerCategoryDto>);
    });

    it('should throw BadRequestException if passed category name not found', async () => {
      const wgerResponseEmpty: WgerCategoryResponseDto = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponseEmpty),
      });
      await expect(provider.getCategories('asd')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
