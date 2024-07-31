import { Test, TestingModule } from '@nestjs/testing';
import { WgerService } from './wger-service';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { DtosModule } from '../../dtos/dtos.module';
import { WgerExerciseDto } from '../../dtos/wger-exercise-dto/wger-exercise-dto';
import { BadRequestException } from '@nestjs/common';

describe('WgerService (integration tests)', () => {
  let provider: WgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DtosModule],
      providers: [WgerService],
    }).compile();

    provider = module.get<WgerService>(WgerService);
  });

  describe('getExercises', () => {
    const searchTerm = '2 Handed Kettlebell Swing';

    it('should throw BadRequestException if Wger returns 0 exercises', async () => {
      const incorrectTerm = 'agodiljsidbjweiosjvksadjvka';
      await expect(provider.getExercises(1, incorrectTerm)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return matching exercises if search term not empty and exercises are found', async () => {
      const result = await provider.getExercises(1, searchTerm);

      expect(result).toBeInstanceOf(Array<WgerExerciseDto>);
    });

    it('should return different exercises based on page ', async () => {
      const resultFirstPage = await provider.getExercises(1);
      const resultSecondPage = await provider.getExercises(2);

      expect(resultFirstPage).not.toEqual(resultSecondPage);
    });

    it('should return exercises that match sent equipment', async () => {
      const resultFirstPage = await provider.getExercises(1, '', '', 'Bench');
      const equipment = (await provider.getEquipment('Bench')).at(0);

      resultFirstPage.forEach((exercise) => {
        expect(
          exercise.equipment.some(
            (equipmentNumber) => equipmentNumber === equipment.id,
          ),
        ).toBe(true);
      });
    });

    it('should return exercises that match sent equipment, but should be different exercises on different pages', async () => {
      const resultFirstPage = await provider.getExercises(1, '', '', 'Bench');
      const resultSecondPage = await provider.getExercises(2, '', '', 'Bench');

      expect(resultFirstPage).not.toEqual(resultSecondPage);
    });

    it('should return exercises that match sent equipment and category', async () => {
      const resultFirstPage = await provider.getExercises(
        1,
        '',
        'Chest',
        'Bench',
      );
      const category = (await provider.getCategories('Chest')).at(0);
      const equipment = (await provider.getEquipment('Bench')).at(0);

      resultFirstPage.forEach((exercise) => {
        expect(
          exercise.equipment.some(
            (equipmentNumber) => equipmentNumber === equipment.id,
          ),
        ).toBe(true);

        expect(exercise.category).toBe(category.id);
      });
    });

    it('should return exercises that match search term, category and equipment', async () => {
      const resultFirstPage = await provider.getExercises(
        1,
        'Bench Press',
        'Chest',
        'Bench',
      );
      const category = (await provider.getCategories('Chest')).at(0);
      const equipment = (await provider.getEquipment('Bench')).at(0);

      resultFirstPage.forEach((exercise) => {
        expect(exercise.name).toContain('Bench Press');
        expect(
          exercise.equipment.some(
            (equipmentNumber) => equipmentNumber === equipment.id,
          ),
        ).toBe(true);

        expect(exercise.category).toBe(category.id);
      });
    });

    it('should return exercises that match search term and category', async () => {
      const resultFirstPage = await provider.getExercises(
        1,
        'Bench Press',
        'Chest',
        '',
      );
      const category = (await provider.getCategories('Chest')).at(0);

      resultFirstPage.forEach((exercise) => {
        expect(exercise.name).toContain('Bench Press');
        expect(exercise.category).toBe(category.id);
      });
    });

    it('should return exercises that match category', async () => {
      const resultFirstPage = await provider.getExercises(1, '', 'Chest', '');
      const category = (await provider.getCategories('Chest')).at(0);

      resultFirstPage.forEach((exercise) => {
        expect(exercise.category).toBe(category.id);
      });
    });

    it('should return differnt exercises that match category, but have different page', async () => {
      const resultFirstPage = await provider.getExercises(1, '', 'Chest', '');
      const resultSecondPage = await provider.getExercises(2, '', 'Chest', '');

      expect(resultFirstPage).not.toEqual(resultSecondPage);
    });

    it('should return exercises that match equipment and search term', async () => {
      const resultFirstPage = await provider.getExercises(
        1,
        'Bench Press',
        '',
        'Bench',
      );
      const equipment = (await provider.getEquipment('Bench')).at(0);

      resultFirstPage.forEach((exercise) => {
        expect(
          exercise.equipment.some(
            (equipmentNumber) => equipmentNumber === equipment.id,
          ),
        );
      });
    });
  });

  describe('getCategories', () => {
    it('should return 8 categories if no parameters passed', async () => {
      const result = await provider.getCategories();
      expect(result).toHaveLength(8);
    });

    it('should return specific category if correct category name passed', async () => {
      const result = await provider.getCategories('Abs');
      expect(result).toHaveLength(1);
    });

    it('should throw BadRequestException if no categories found', async () => {
      await expect(provider.getCategories('sba')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getEquipment', () => {
    it('should return all equipment if no parameter passed', async () => {
      const result = await provider.getEquipment();

      expect(result).toHaveLength(10);
    });

    it('throw BadRequestException if equipment with specific name not found', async () => {
      await expect(provider.getEquipment('k')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('return specific equipment if equipment name found in Wger API', async () => {
      const result = await provider.getEquipment('Bench');
      expect(result).toHaveLength(1);
    });
  });
});
