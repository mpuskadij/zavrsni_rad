import { Test, TestingModule } from '@nestjs/testing';
import { WgerService } from './wger-service';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { DtosModule } from '../../dtos/dtos.module';
import { WgerExerciseDto } from '../../dtos/wger-variaton-dto/wger-variaton-dto';
import { rejects } from 'assert';
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

  describe('getExercisesBySearchTerm', () => {
    const searchTerm = '2 Handed Kettlebell Swing';

    it('should throw BadRequestException if Wger returns 0 exercises', async () => {
      const incorrectTerm = 'agodiljsidbjweiosjvksadjvka';
      await expect(
        provider.getExercisesBySearchTerm(1, incorrectTerm),
      ).rejects.toThrow('No exercises matching search term found!');
    });

    it('should return matching exercises if search term not empty and exercises are found', async () => {
      const result = await provider.getExercisesBySearchTerm(1, searchTerm);

      expect(result).toBeInstanceOf(Array<WgerExerciseDto>);
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
});
