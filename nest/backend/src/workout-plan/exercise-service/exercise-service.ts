import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Exercise } from '../../entities/exercise/exercise';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExerciseService {
  async findExerciseInWorkoutPlan(
    exercises: Exercise[],
    nameOfExerciseToDelete: string,
  ): Promise<Exercise> {
    if (!exercises || !nameOfExerciseToDelete) {
      throw new InternalServerErrorException(
        'Server had trouble finding exercises of the workout plan!',
      );
    }
    if (!exercises.length) {
      throw new ForbiddenException("You don't have any exercises yet!");
    }

    const foundExercise = exercises.find(
      (execise) => execise.name == nameOfExerciseToDelete,
    );
    if (!foundExercise) {
      throw new InternalServerErrorException(
        'Server had trouble finding exercise you want to delete!',
      );
    }
    return foundExercise;
  }
  async createExercise(
    name: string,
    description: string,
    category: string,
    equipment: string,
  ): Promise<Exercise> {
    if (!name) {
      throw new BadRequestException('Invalid exercise name!');
    }
    if (!category) {
      throw new InternalServerErrorException(
        'Server could not find category of the exercise!',
      );
    }

    const exercise = new Exercise();
    exercise.category = category;
    exercise.description = description;
    exercise.equipment = equipment;
    exercise.name = name;

    return exercise;
  }
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}
  async getExcerciseByName(exerciseName: string): Promise<Exercise> {
    if (!exerciseName) {
      throw new BadRequestException('Method not implemented.');
    }
    const exerciseInDatabase = await this.exerciseRepository.findOne({
      where: { name: exerciseName },
    });

    return exerciseInDatabase;
  }
}
