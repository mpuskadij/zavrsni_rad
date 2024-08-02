import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesModule } from '../../entities/entities.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user/user';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { Exercise } from '../../entities/exercise/exercise';
import { Repository } from 'typeorm';
import { WorkoutPlanService } from './workout-plan-service';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users-service/users-service';

describe('WorkoutPlanService (integration tests)', () => {
  let provider: WorkoutPlanService;
  let username = 'marin';
  let password = 'ajskfnU7';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EntitiesModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Bmientry, JournalEntry, WorkoutPlan, Exercise],
        }),
        TypeOrmModule.forFeature([
          User,
          JournalEntry,
          Bmientry,
          WorkoutPlan,
          Exercise,
        ]),
      ],
      providers: [WorkoutPlanService, Repository<WorkoutPlan>],
    }).compile();
    provider = module.get<WorkoutPlanService>(WorkoutPlanService);
  });

  describe('getWorkout ById', () => {
    it('should throw InternalServerException if workout plan with specific id not found', async () => {
      await expect(provider.getWorkoutPlanByID(22.5)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
