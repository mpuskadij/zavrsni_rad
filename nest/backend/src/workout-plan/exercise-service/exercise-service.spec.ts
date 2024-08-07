import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise-service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../../entities/exercise/exercise';
import e from 'express';

describe('ExerciseService (unit tests)', () => {
  let provider: ExerciseService;
  let mockExerciseRepository = { findOne: jest.fn(), save: jest.fn() };

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
      await expect(provider.getExcerciseByName('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return null if exercise not found', async () => {
      mockExerciseRepository.findOne.mockResolvedValue(null);
      const result = await provider.getExcerciseByName('Bench Press');
      expect(result).toBeNull();
    });

    it('should return Exercise if found in database', async () => {
      const exercise = new Exercise();
      exercise.name = 'Bench Press';
      mockExerciseRepository.findOne.mockResolvedValue(exercise);
      const result = await provider.getExcerciseByName('Bench Press');
      expect(result).not.toBeNull();
      expect(result.name).toEqual(exercise.name);
    });
  });

  describe('createExercise', () => {
    const name = 'Bench Press';
    const description = '';
    const category = 'Bench';
    const equipment = '';

    it('should throw BadRequestException if name for the exercise is empty', async () => {
      const result = () => provider.createExercise('', '', '', '');
      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if category for the exercise is empty', async () => {
      const result = () => provider.createExercise(name, '', '', '');
      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return newly created Exercise', async () => {
      const exercise: Exercise = {
        id: 1,
        name: name,
        description: description,
        equipment: equipment,
        category: category,
      };
      mockExerciseRepository.save.mockResolvedValue(exercise);
      const result = await provider.createExercise(
        name,
        description,
        category,
        equipment,
      );
      expect(result).toBeInstanceOf(Exercise);
      expect(result.name).toEqual(name);
      expect(result.category).toEqual(category);
      expect(result.description).toEqual(description);
      expect(result.equipment).toEqual(equipment);
    });
  });

  describe('deleteExercise', () => {
    it('should throw InternalServerError if exercise array is falsy', async () => {
      const result = () => provider.findExerciseInWorkoutPlan(null, 'bac');

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if name of the exercise to delete is falsy', async () => {
      const result = () => provider.findExerciseInWorkoutPlan([], '');

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw ForbiddenException if exercise array is empty', async () => {
      const result = () => provider.findExerciseInWorkoutPlan([], 'abc');

      expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerError if exersie name not found', async () => {
      const exercise = new Exercise();
      exercise.name = 'Bench Press';
      const exercises = [exercise];
      const result = () => provider.findExerciseInWorkoutPlan(exercises, 'abc');

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('return the exercise that matches the name', async () => {
      const exercise = new Exercise();
      exercise.name = 'Bench Press';
      const exercises = [exercise];
      const result = await provider.findExerciseInWorkoutPlan(
        exercises,
        exercise.name,
      );

      expect(result.name).toStrictEqual(exercise.name);
    });
  });
});
