import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from 'src/entities/exercise/exercise';

@Injectable()
export class WorkoutPlanService {
  async unassignExercise(
    workoutPlan: WorkoutPlan,
    exerciseToDelete: Exercise,
  ): Promise<void> {
    if (!workoutPlan || !exerciseToDelete) {
      throw new InternalServerErrorException(
        'Server had trouble finding your workout plan!',
      );
    }

    if (!workoutPlan.exercises?.length) {
      throw new InternalServerErrorException(
        'Server could not find exercises that belong to your workout plan!',
      );
    }

    const indexOfExerciseToDelete =
      workoutPlan.exercises.indexOf(exerciseToDelete);

    if (indexOfExerciseToDelete == -1) {
      throw new InternalServerErrorException(
        'Server could not find the exercise to delete in your workout plan!',
      );
    }

    workoutPlan.exercises.splice(indexOfExerciseToDelete);

    await this.saveWorkoutPlan(workoutPlan);
  }

  async getExercises(workoutPlan: WorkoutPlan): Promise<Exercise[]> {
    if (!workoutPlan) {
      throw new InternalServerErrorException(
        'Server had trouble finding the workout plan!',
      );
    }

    if (!workoutPlan.exercises?.length) {
      throw new ForbiddenException("You don't have any exercises yet!");
    }

    return workoutPlan.exercises;
  }
  async deleteWorkoutPlan(
    workoutPlans: WorkoutPlan[],
    idOfWorkoutPlanToDelete: number,
  ): Promise<WorkoutPlan> {
    if (!idOfWorkoutPlanToDelete || !workoutPlans) {
      throw new InternalServerErrorException(
        'Server had trouble deleting your workout plan!',
      );
    }
    if (!workoutPlans.length) {
      throw new ForbiddenException(
        "You don't have any workout plans to delete!",
      );
    }
    const foundPlan = workoutPlans.find(
      (workoutPlan) => workoutPlan.id == idOfWorkoutPlanToDelete,
    );
    if (!foundPlan) {
      throw new InternalServerErrorException(
        'Server had trouble deleting the workout plan!',
      );
    }
    return await this.workoutPlanRepostitory.remove(foundPlan);
  }
  async checkIfExerciseAlreadyInWorkoutPlan(
    workoutPlanToCheck: WorkoutPlan,
    exerciseName: string,
  ): Promise<boolean> {
    if (!workoutPlanToCheck?.exercises || !exerciseName) {
      throw new InternalServerErrorException(
        'Server had trouble if exercise is already in the workout plan!',
      );
    }
    const hasNoExercises = !workoutPlanToCheck.exercises.length;
    if (hasNoExercises) return false;
    const foundExercise: boolean = workoutPlanToCheck.exercises.some(
      (exercise) => exercise.name == exerciseName,
    );
    return foundExercise;
  }
  async addExercise(
    workoutPlan: WorkoutPlan,
    exercise: Exercise,
  ): Promise<void> {
    if (!workoutPlan || !exercise) {
      throw new InternalServerErrorException(
        'Server had trouble adding exercise to your workout plan!',
      );
    }
    workoutPlan.exercises.push(exercise);
    await this.saveWorkoutPlan(workoutPlan);
    return;
  }

  private async saveWorkoutPlan(
    workoutPlan: WorkoutPlan,
  ): Promise<WorkoutPlan> {
    return await this.workoutPlanRepostitory.save(workoutPlan);
  }

  async checkIfWorkoutPlanBelongsToUser(
    username: string,
    workoutPlan: WorkoutPlan,
  ): Promise<void> {
    if (!username) {
      throw new BadRequestException('Server did not receive username!');
    }
    if (!workoutPlan) {
      throw new InternalServerErrorException('Error getting workout plan!');
    }

    if (workoutPlan.username != username) {
      throw new BadRequestException(
        "You don't have a workout plan with that ID!",
      );
    }
  }
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
    workoutPlan.exercises = [];

    return workoutPlan;
  }
}
