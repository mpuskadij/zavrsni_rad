import {
  BadRequestException,
  INestApplication,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { CrpytoModule } from '../../crpyto/crpyto.module';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { ExerciseService } from '../exercise-service/exercise-service';
import { Food } from '../../entities/food/food';
import { UserFood } from '../../entities/user_food/user_food';

describe('WorkoutPlanService (integration tests)', () => {
  let provider: WorkoutPlanService;
  let usersService: UsersService;
  let exerciseService: ExerciseService;
  let username = 'marin';
  let differentUsername = 'niram';
  let userRepo: Repository<User>;
  let exerciseRepo: Repository<Exercise>;
  let password = 'ajskfnU7';
  const title = "Get movin'";
  const exerciseName = 'Bench Press';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EntitiesModule,
        CrpytoModule,
        AuthenticationModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [
            User,
            Bmientry,
            JournalEntry,
            WorkoutPlan,
            Exercise,
            Food,
            UserFood,
          ],
        }),
        TypeOrmModule.forFeature([
          User,
          JournalEntry,
          Bmientry,
          WorkoutPlan,
          Exercise,
          Food,
          UserFood,
        ]),
      ],
      providers: [
        WorkoutPlanService,
        Repository<WorkoutPlan>,
        UsersService,
        Repository<User>,
        Repository<Exercise>,
        ExerciseService,
      ],
    }).compile();
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    exerciseRepo = module.get<Repository<Exercise>>(
      getRepositoryToken(Exercise),
    );
    const user = await userRepo.findOne({
      where: { username: username },
      relations: ['journalEntries', 'bmiEntries', 'workoutPlans'],
    });
    if (user) {
      await userRepo.remove(user);
    }

    const differentUser = await userRepo.findOne({
      where: { username: differentUsername },
      relations: ['journalEntries', 'bmiEntries', 'workoutPlans'],
    });
    if (differentUser) {
      await userRepo.remove(differentUser);
    }

    const exercise = await exerciseRepo.findOne({
      where: { name: exerciseName },
    });
    if (exercise) {
      await exerciseRepo.remove(exercise);
    }
    usersService = module.get<UsersService>(UsersService);
    exerciseService = module.get<ExerciseService>(ExerciseService);
    provider = module.get<WorkoutPlanService>(WorkoutPlanService);
  });

  describe('getWorkoutById', () => {
    it('should throw InternalServerException if workout plan with specific id not found', async () => {
      await expect(provider.getWorkoutPlanByID(22.5)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return the workout that matches the id', async () => {
      await usersService.addUser(username, password);
      const workoutPlan = await provider.createWorkoutPlan(title);
      const exercise = await exerciseService.createExercise(
        exerciseName,
        'Bench press',
        'Chest',
        'Bench',
      );
      const user = await usersService.getUser(username);
      await usersService.assignWorkoutPlan(user, workoutPlan);
      await provider.addExercise(workoutPlan, exercise);
      const userWithWorkoutPlan = await usersService.getUser(username);
      const id = userWithWorkoutPlan.workoutPlans[0].id;

      const result = await provider.getWorkoutPlanByID(id);

      expect(result).toBeDefined();
      expect(result.id).toBe(id);
    });
  });

  describe('checkIfExerciseAlreadyInWorkoutPlan', () => {
    it('should return false if user has no exercises', async () => {
      const workoutPlan = await provider.createWorkoutPlan(title);
      const result = await provider.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlan,
        exerciseName,
      );
      expect(result).toBe(false);
    });

    it('should return true if exercise with name not found', async () => {
      await usersService.addUser(username, password);
      const workoutPlan = await provider.createWorkoutPlan(title);
      const exercise = await exerciseService.createExercise(
        exerciseName,
        'Bench press',
        'Chest',
        'Bench',
      );
      const user = await usersService.getUser(username);
      await usersService.assignWorkoutPlan(user, workoutPlan);
      await provider.addExercise(workoutPlan, exercise);
      const result = await provider.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlan,
        exerciseName,
      );
      expect(result).toBe(true);
    });

    it('should return false if exercise with name not found', async () => {
      await usersService.addUser(username, password);
      const workoutPlan = await provider.createWorkoutPlan(title);
      const exercise = await exerciseService.createExercise(
        exerciseName,
        'Bench press',
        'Chest',
        'Bench',
      );
      const user = await usersService.getUser(username);
      await usersService.assignWorkoutPlan(user, workoutPlan);
      await provider.addExercise(workoutPlan, exercise);
      const result = await provider.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlan,
        'Deadlift',
      );
      expect(result).toBe(false);
    });
  });

  describe('addExercise', () => {
    it('should add exercise into existing workout plan', async () => {
      await usersService.addUser(username, password);
      const workoutPlan = await provider.createWorkoutPlan(title);
      const exercise = await exerciseService.createExercise(
        exerciseName,
        'Bench press',
        'Chest',
        'Bench',
      );
      const user = await usersService.getUser(username);
      await usersService.assignWorkoutPlan(user, workoutPlan);
      await provider.addExercise(workoutPlan, exercise);
      expect(user.workoutPlans[0].exercises).toHaveLength(1);
    });
  });

  describe('checkIfWorkoutPlanBelongsToUser', () => {
    it('should throw BadRequestException if user is not the owner of the workout plan', async () => {
      await usersService.addUser(username, password);
      await usersService.addUser(differentUsername, password);
      const workoutPlan = await provider.createWorkoutPlan(title);
      const user = await usersService.getUser(username);
      await usersService.assignWorkoutPlan(user, workoutPlan);

      const result = () =>
        provider.checkIfWorkoutPlanBelongsToUser(
          differentUsername,
          workoutPlan,
        );
      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should finish if workout plan belongs to user', async () => {
      await usersService.addUser(username, password);
      await usersService.addUser(differentUsername, password);
      const workoutPlan = await provider.createWorkoutPlan(title);
      const user = await usersService.getUser(username);
      await usersService.assignWorkoutPlan(user, workoutPlan);

      const result = () =>
        provider.checkIfWorkoutPlanBelongsToUser(username, workoutPlan);
      expect(result).resolves;
    });
  });
});
