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
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}
  async getExceriseByName(exerciseName: string): Promise<Exercise> {
    if (!exerciseName) {
      throw new BadRequestException('Method not implemented.');
    }
    const exerciseInDatabase = await this.exerciseRepository.findOne({
      where: { name: exerciseName },
    });

    return exerciseInDatabase;
  }
}
