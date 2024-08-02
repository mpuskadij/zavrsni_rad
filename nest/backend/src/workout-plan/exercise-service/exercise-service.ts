import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Exercise } from '../../entities/exercise/exercise';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExerciseService {
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
