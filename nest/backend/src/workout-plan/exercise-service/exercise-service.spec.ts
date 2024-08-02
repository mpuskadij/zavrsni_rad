import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise-service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../../entities/exercise/exercise';

describe('ExerciseService (unit tests)', () => {
  let provider: ExerciseService;
  let mockExerciseRepository = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        {
          provide: getRepositoryToken(Exercise),
          useValue: mockExerciseRepository,
        },
      ],
    }).compile();

    provider = module.get<ExerciseService>(ExerciseService);
  });

  describe('getExceriseByName', () => {
    it('should throw BadRequestException if name not passed', async () => {
      await expect(provider.getExceriseByName('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return null if exercise not found', async () => {
      mockExerciseRepository.findOne.mockResolvedValue(null);
      const result = await provider.getExceriseByName('Bench Press');
      expect(result).toBeNull();
    });

    it('should return Exercise if found in database', async () => {
      const exercise = new Exercise();
      exercise.name = 'Bench Press';
      mockExerciseRepository.findOne.mockResolvedValue(exercise);
      const result = await provider.getExceriseByName('Bench Press');
      expect(result).not.toBeNull();
      expect(result.name).toEqual(exercise.name);
    });
  });
});
