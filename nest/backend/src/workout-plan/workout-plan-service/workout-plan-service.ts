import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkoutPlanService {
  constructor(
    @InjectRepository(WorkoutPlan)
    private workoutPlanRepostitory: Repository<WorkoutPlan>,
  ) {}
  async getWorkoutPlanByID(idOfWorkoutPlan: number): Promise<WorkoutPlan> {
    if (!idOfWorkoutPlan) {
      throw new BadRequestException('Id must be a number!');
    }
    const workoutPlan: WorkoutPlan = await this.workoutPlanRepostitory.findOne({
      where: { id: idOfWorkoutPlan },
      relations: ['exercises', 'user'],
    });
    if (!workoutPlan) {
      throw new InternalServerErrorException(
        'Workout plan with given id not found!',
      );
    }
    return workoutPlan;
  }
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
