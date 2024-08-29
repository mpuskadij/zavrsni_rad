import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanService } from './workout-plan-service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { EntitiesModule } from '../../entities/entities.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../../entities/exercise/exercise';
import { VirtualTimeService } from '../../admin/virtual-time-service/virtual-time-service';

describe('WorkoutPlanService (unit tests)', () => {
  let provider: WorkoutPlanService;
  const mockWorkoutPlanRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockVirtualTimeService = { getTime: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule],
      providers: [
        WorkoutPlanService,
        {
          provide: getRepositoryToken(WorkoutPlan),
          useValue: mockWorkoutPlanRepository,
        },
        { provide: VirtualTimeService, useValue: mockVirtualTimeService },
      ],
    }).compile();

    provider = module.get<WorkoutPlanService>(WorkoutPlanService);
  });

  describe('createWorkoutPlan', () => {
    const title: string = 'Get up and going!';

    it('should throw BadRequestException if title null,undefined or empty', async () => {
      await expect(provider.createWorkoutPlan('sdasdas', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if username null,undefined or empty', async () => {
      await expect(
        provider.createWorkoutPlan('', 'asdasdasdas'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return new workout plan if title passed', async () => {
      mockWorkoutPlanRepository.save.mockResolvedValue(new WorkoutPlan());
      await provider.createWorkoutPlan('username', title);

      expect(mockWorkoutPlanRepository.save).toHaveBeenCalled();
    });
  });

  describe('getWorkoutPlanByID', () => {
    const id: number = 1;

    it('should throw BadRequestException if id is not a number, null or undefined', async () => {
      await expect(provider.getWorkoutPlanByID(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServer if workout plan with id not found', async () => {
      mockWorkoutPlanRepository.findOne.mockResolvedValue(null);
      await expect(provider.getWorkoutPlanByID(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return workout plan that matches the id', async () => {
      const foundWorkoutPlan: WorkoutPlan = new WorkoutPlan();
      foundWorkoutPlan.id = id;
      mockWorkoutPlanRepository.findOne.mockResolvedValue(foundWorkoutPlan);
      const result: WorkoutPlan = await provider.getWorkoutPlanByID(id);

      expect(mockWorkoutPlanRepository.findOne).toHaveBeenCalled();
      expect(result.id).toEqual(id);
    });
  });

  describe('checkIfWorkoutPlanBelongsToUser', () => {
    it('should return BadRequestException if username null or empty', async () => {
      await expect(
        provider.checkIfWorkoutPlanBelongsToUser('', new WorkoutPlan()),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return InternalServerException if workout plan null or empty', async () => {
      await expect(
        provider.checkIfWorkoutPlanBelongsToUser('marin', null),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw BadRequestException if workout doesnt belong to the user', async () => {
      const workoutPlan: WorkoutPlan = new WorkoutPlan();
      workoutPlan.title = 'Get going!';
      workoutPlan.username = 'niram';
      await expect(
        provider.checkIfWorkoutPlanBelongsToUser('marin', workoutPlan),
      ).rejects.toThrow(BadRequestException);
    });

    it('should pass if workout plans belongs to the user', async () => {
      const workoutPlan: WorkoutPlan = new WorkoutPlan();
      workoutPlan.title = 'Get going!';
      workoutPlan.username = 'marin';
      await expect(
        provider.checkIfWorkoutPlanBelongsToUser('marin', workoutPlan),
      ).resolves;
    });
  });

  describe('addExercise', () => {
    it('should throw InternalServerException if workout plan is falsy', async () => {
      const result = () => provider.addExercise(null, new Exercise());
      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerException if exercise is falsy', async () => {
      const result = () => provider.addExercise(new WorkoutPlan(), null);
      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should add exercise to workout plan if plan has 0 existing exercises', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.exercises = [];
      const exercise = new Exercise();
      const updatedWorkoutPlan = new WorkoutPlan();
      updatedWorkoutPlan.exercises = [exercise];
      mockWorkoutPlanRepository.save.mockResolvedValue(updatedWorkoutPlan);
      await provider.addExercise(workoutPlan, exercise);
      expect(workoutPlan.exercises).toHaveLength(1);
    });

    it('should add exercise to workout plan if plan has 1 existing exercises', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.exercises = [];
      const exercise = new Exercise();
      const exercise2 = new Exercise();
      const updatedWorkoutPlan = new WorkoutPlan();
      updatedWorkoutPlan.exercises = [exercise, exercise2];
      mockWorkoutPlanRepository.save
        .mockResolvedValueOnce(workoutPlan)
        .mockResolvedValueOnce(updatedWorkoutPlan);
      await provider.addExercise(workoutPlan, exercise);
      await provider.addExercise(workoutPlan, exercise2);
      expect(workoutPlan.exercises).toHaveLength(2);
    });
  });

  describe('checkIfExerciseAlreadyInWorkoutPlan', () => {
    const workoutPlan = new WorkoutPlan();
    const exercise = new Exercise();
    exercise.name = 'Bench Press';
    workoutPlan.exercises = [exercise];

    it('should throw InternalServerError if workout plan or exercise name falsy', async () => {
      const result = () =>
        provider.checkIfExerciseAlreadyInWorkoutPlan(null, '');
      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return true if exercise exists in the workout plan already', async () => {
      const result = await provider.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlan,
        'Bench Press',
      );
      expect(result).toBe(true);
    });

    it('should return false if workout plan has no exercises', async () => {
      const workoutPlanNoExercises = new WorkoutPlan();
      workoutPlanNoExercises.exercises = [];
      const result = await provider.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlanNoExercises,
        'Bench Press',
      );
      expect(result).toBe(false);
    });

    it('should return false if exercise name not found', async () => {
      const result = await provider.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlan,
        'Deadlift',
      );
      expect(result).toBe(false);
    });
  });

  describe('deleteWorkoutPlan', () => {
    it('should throw InternalServerException if array of workout plans is null or undefined', async () => {
      const result = () => provider.deleteWorkoutPlan(null, 2);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerException if number not a number', async () => {
      const result = () => provider.deleteWorkoutPlan([], null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw ForbiddenException if user has no workout plans', async () => {
      const result = () => provider.deleteWorkoutPlan([], 1);

      expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerError if workout plan with given id not found', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.id = 1;
      const result = () => provider.deleteWorkoutPlan([workoutPlan], 2);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should delete the workout plan when truthy workout plan received', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.id = 1;
      mockWorkoutPlanRepository.remove.mockResolvedValue(workoutPlan);
      const result = await provider.deleteWorkoutPlan(
        [workoutPlan],
        workoutPlan.id,
      );

      expect(result).toStrictEqual(workoutPlan);
    });
  });

  describe('getExercises', () => {
    it('should throw InternalServerError if workout plan is falsy', async () => {
      const result = () => provider.getExercises(null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw ForbiddenException ifuser has no exercises', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.exercises = [];
      const result = () => provider.getExercises(workoutPlan);

      expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should return all exercises if user has exercises', async () => {
      const workoutPlan = new WorkoutPlan();
      const exercise = new Exercise();
      exercise.id = 1;
      workoutPlan.exercises = [exercise];
      const result = await provider.getExercises(workoutPlan);

      expect(result).toStrictEqual(workoutPlan.exercises);
    });
  });

  describe('unassignExercise', () => {
    it('should throw InternalServerError if workout plan is falsy', async () => {
      const result = () => provider.unassignExercise(null, new Exercise());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if exercise to delete is falsy', async () => {
      const result = () => provider.unassignExercise(new WorkoutPlan(), null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if workout plan has no exercises', async () => {
      const result = () =>
        provider.unassignExercise(new WorkoutPlan(), new Exercise());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if index of exercise to delete not found', async () => {
      const exercise = new Exercise();
      exercise.name = 'Bench Press';
      const workoutPlan = new WorkoutPlan();
      workoutPlan.exercises = [exercise];
      const result = () =>
        provider.unassignExercise(workoutPlan, new Exercise());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should remove exercise if found', async () => {
      const exercise = new Exercise();
      exercise.name = 'Bench Press';
      const workoutPlan = new WorkoutPlan();
      workoutPlan.exercises = [exercise];
      await provider.unassignExercise(workoutPlan, exercise);

      expect(workoutPlan.exercises).toHaveLength(0);
    });
  });
});
