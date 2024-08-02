import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseService } from './exercise-service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../../entities/exercise/exercise';
import e from 'express';
import { Repository } from 'typeorm';

describe('ExerciseService (unit tests)', () => {
  let provider: ExerciseService;
  let exerciseRepo: Repository<Exercise>;
  const exerciseName = 'Bench Press';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [Exercise],
        }),
        TypeOrmModule.forFeature([Exercise]),
      ],
      providers: [ExerciseService, Repository<Exercise>],
    }).compile();

    provider = module.get<ExerciseService>(ExerciseService);
    exerciseRepo = module.get<Repository<Exercise>>(
      getRepositoryToken(Exercise),
    );
    const exerciseInDatabase = await exerciseRepo.findOne({
      where: { name: exerciseName },
    });
    if (exerciseInDatabase) {
      await exerciseRepo.remove(exerciseInDatabase);
    }
  });

  describe('getExceriseByName', () => {
    it('should return null if exercise not found', async () => {
      const result = await provider.getExcerciseByName('lsijdfoisdj');
      expect(result).toBeNull();
    });

    it('should return Exercise if found in database', async () => {
      const exercise = new Exercise();
      exercise.name = exerciseName;
      exercise.description = '';
      exercise.category = 'Chest';
      exercise.equipment = 'Bench';
      await exerciseRepo.save(exercise);
      const result = await provider.getExcerciseByName(exerciseName);
      expect(result).not.toBeNull();
      expect(result.name).toEqual(exercise.name);
    });
  });
});
