import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';

@Injectable()
export class WorkoutPlanService {
  async createWorkoutPlan(title: string): Promise<WorkoutPlan> {
    if (!title) {
      throw new BadRequestException(
        'Please provide a valid title for the workout plan!',
      );
    }
    const workoutPlan: WorkoutPlan = new WorkoutPlan();
    workoutPlan.title = title;

    return workoutPlan;
  }
}
