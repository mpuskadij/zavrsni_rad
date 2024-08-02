import { Test, TestingModule } from '@nestjs/testing';
import { WgerService } from './wger-service';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { DtosModule } from '../../dtos/dtos.module';
import { WgerExerciseDto } from '../../dtos/wger-exercise-dto/wger-exercise-dto';
import { WgerCategoryResponseDto } from 'src/dtos/wger-category-response-dto/wger-category-response-dto';
import {
  BadRequestException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { WgerCategoryDto } from 'src/dtos/wger-category-dto/wger-category-dto';
import { WgerEquipmentDto } from 'src/dtos/wger-equipment-dto/wger-equipment-dto';

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

  describe('getExercises', () => {
    const searchTerm = '2 Handed Kettlebell Swing';

    it('should throw BadRequestException if page is not a number', async () => {
      await expect(provider.getExercises(null)).rejects.toThrow(
        'Page must be a number',
      );
    });

    it('should throw ServiceUnavailable if Wger returns status different than 200', async () => {
      const incorrectTerm = 'asdlksjdgj';
      mockFetch.mockResolvedValue({ ok: false });
      await expect(provider.getExercises(1, incorrectTerm)).rejects.toThrow(
        'Error while communnicating with external API!',
      );
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
      await expect(provider.getExercises(1, incorrectTerm)).rejects.toThrow(
        BadRequestException,
      );
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
      const result = await provider.getExercises(1, searchTerm);

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

  describe('getEquipment', () => {
    it('should throw ServiceUnavailable if wger doesnt return 200 OK response', async () => {
      mockFetch.mockResolvedValue({ ok: false });
      await expect(provider.getEquipment()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should return list of all equipment if no parameter passed', async () => {
      const equipment: WgerEquipmentDto = { id: 1, name: 'Kettlebell' };
      const wgerResponse: WgerCategoryResponseDto = {
        count: 1,
        next: null,
        previous: null,
        results: [equipment],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      const result = await provider.getEquipment();

      expect(result).toHaveLength(1);
    });

    it('should throw BadRequestException when equipment name passed, but not found ', async () => {
      const wgerResponse: WgerCategoryResponseDto = {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      await expect(provider.getEquipment('k')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCategoryNameByID', () => {
    it('throw InternalServerException if id not a number', async () => {
      const result = () => provider.getCategoryNameById(null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('return category name if ID found', async () => {
      const allCategories: WgerCategoryDto[] = [];
      allCategories.push({ id: 1, name: 'Bench' });
      jest.spyOn(provider, 'getCategories').mockResolvedValue(allCategories);
      const result = await provider.getCategoryNameById(1);

      expect(result).toEqual('Bench');
    });

    it('throw InternalServerException if category not found', async () => {
      const allCategories: WgerCategoryDto[] = [];
      allCategories.push({ id: 1, name: 'Bench' });
      jest.spyOn(provider, 'getCategories').mockResolvedValue(allCategories);
      const result = () => provider.getCategoryNameById(2);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getEquipmentNamesById', () => {
    it('should return empty string if array is empty', async () => {
      const result = await provider.getEquipmentNamesById([]);

      expect(result).toEqual('');
    });

    it('should return empty string if id not found', async () => {
      jest.spyOn(provider, 'getEquipment').mockResolvedValue([]);
      const result = await provider.getEquipmentNamesById([1]);

      expect(result).toEqual('');
    });

    it('should get Equipment name if array has lenght of 1', async () => {
      const equipment: WgerEquipmentDto = { id: 1, name: 'Bench' };
      jest.spyOn(provider, 'getEquipment').mockResolvedValue([equipment]);
      const result = await provider.getEquipmentNamesById([1]);

      expect(result).toEqual('Bench');
    });

    it('should get Equipment name if array has lenght of 1', async () => {
      const equipment: WgerEquipmentDto = { id: 1, name: 'Bench' };
      const equipment2: WgerEquipmentDto = { id: 2, name: 'Exercise mat' };
      jest
        .spyOn(provider, 'getEquipment')
        .mockResolvedValue([equipment, equipment2]);
      const result = await provider.getEquipmentNamesById([1, 2]);

      expect(result).toEqual('Bench,Exercise mat');
    });

    it('should not return equipment name if equipment name is empty!', async () => {
      const equipment: WgerEquipmentDto = { id: 1, name: 'Bench' };
      const equipment2: WgerEquipmentDto = { id: 2, name: '' };
      jest
        .spyOn(provider, 'getEquipment')
        .mockResolvedValue([equipment, equipment2]);
      const result = await provider.getEquipmentNamesById([1, 2]);

      expect(result).toEqual('Bench');
    });

    it('should not return equipment name if equipment name is empty!', async () => {
      const equipment: WgerEquipmentDto = { id: 1, name: '' };
      const equipment2: WgerEquipmentDto = { id: 2, name: 'Exercise mat' };
      jest
        .spyOn(provider, 'getEquipment')
        .mockResolvedValue([equipment, equipment2]);
      const result = await provider.getEquipmentNamesById([1, 2]);

      expect(result).toEqual('Exercise mat');
    });
  });
});
