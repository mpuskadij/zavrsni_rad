import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanService } from './workout-plan-service';
import { BadRequestException } from '@nestjs/common';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { EntitiesModule } from '../../entities/entities.module';

describe('WorkoutPlanService (unit tests)', () => {
  let provider: WorkoutPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EntitiesModule],
      providers: [WorkoutPlanService],
    }).compile();

    provider = module.get<WorkoutPlanService>(WorkoutPlanService);
  });

  describe('createWorkoutPlan', () => {
    const title: string = 'Get up and going!';

    it('should throw BadRequestException if title null,undefined or empty', async () => {
      await expect(provider.createWorkoutPlan('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return new workout plan if title passed', async () => {
      const workoutPlan = await provider.createWorkoutPlan(title);

      expect(workoutPlan).toBeInstanceOf(WorkoutPlan);
      expect(workoutPlan.title).toEqual(title);
    });
  });
});
