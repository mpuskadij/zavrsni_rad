import { Test, TestingModule } from '@nestjs/testing';
import { BmiController } from '../src/bmi/bmi/bmi.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { UsersModule } from '../src/users/users.module';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersController } from '../src/users/users/users.controller';
import { Repository } from 'typeorm';
import { UsersService } from '../src/users/users-service/users-service';
import { CryptoService } from '../src/crpyto/crypto-service/crypto-service';
import { SaltGenerator } from '../src/crpyto/salt-generator/salt-generator';
import { HashGenerator } from '../src/crpyto/hash-generator/hash-generator';
import { HashedPasswordData } from '../src/crpyto/hashed-password-data/hashed-password-data';
import { AuthenticationService } from '../src/authentication/authentication-service/authentication-service';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { GuardsModule } from '../src/guards/guards.module';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { NewBmiEntryGuard } from '../src/guards/new-bmi-entry/new-bmi-entry.guard';
import { BmiService } from '../src/bmi/bmi-service/bmi-service';
import { BmiModule } from '../src/bmi/bmi.module';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
import { BmiEntryDto } from '../src/dtos/bmi-entry-dto/bmi-entry-dto';
import { DtosModule } from '../src/dtos/dtos.module';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { WorkoutPlanController } from '../src/workout-plan/workout-plan/workout-plan.controller';
import { WorkoutPlanModule } from '../src/workout-plan/workout-plan.module';
import { WorkoutPlanService } from '../src/workout-plan/workout-plan-service/workout-plan-service';
import { title } from 'process';
import { WgerService } from '../src/workout-plan/wger-service/wger-service';
import { ExerciseService } from '../src/workout-plan/exercise-service/exercise-service';
import { WorkoutPlanDto } from '../src/dtos/workout-plan-dto/workout-plan-dto';
import { plainToInstance } from 'class-transformer';
import * as cookieParser from 'cookie-parser';
import { Food } from '../src/entities/food/food';
import { UserFood } from '../src/entities/user_food/user_food';
import { AdminModule } from '../src/admin/admin.module';

describe('WorkoutPlanController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let exerciseRepo: Repository<Exercise>;
  const username = 'marin';
  const password = 'ajskfnU7';
  const differentUsername = 'niram';
  const differentPassword = 'ajskfnU8';
  const differentPayload: JwtPayload = {
    username: differentUsername,
    isAdmin: 0,
  };
  const payload: JwtPayload = { username: username, isAdmin: 0 };
  const registrationPath = '/api/users/register';
  const validExerciseName = 'Bench Press';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BmiModule,
        AdminModule,
        GuardsModule,
        DtosModule,
        UsersModule,
        CrpytoModule,
        WorkoutPlanModule,
        ConfigModule.forRoot({ envFilePath: '.test.ev' }),
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
          Bmientry,
          JournalEntry,
          WorkoutPlan,
          Exercise,
          Food,
          UserFood,
        ]),
        AuthenticationModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      controllers: [UsersController, WorkoutPlanController],
      providers: [
        Repository<User>,
        Repository<Bmientry>,
        Repository<JournalEntry>,
        Repository<Exercise>,
        UsersService,
        WorkoutPlanService,
        CryptoService,
        SaltGenerator,
        HashGenerator,
        HashedPasswordData,
        AuthenticationService,
        JwtGuard,
        WgerService,
        ExerciseService,
      ],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .overrideGuard(JwtGuard)
      .useValue(true)
      .overrideGuard(NewBmiEntryGuard)
      .useValue(true)
      .compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    exerciseRepo = moduleFixture.get<Repository<Exercise>>(
      getRepositoryToken(Exercise),
    );

    if ((await userRepo.existsBy({ username })) == true) {
      const user = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      await userRepo.remove(user);
    }

    if ((await userRepo.existsBy({ username: differentUsername })) == true) {
      const user = await userRepo.findOne({
        where: { username: differentUsername },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      await userRepo.remove(user);
    }

    if ((await exerciseRepo.existsBy({ name: validExerciseName })) == true) {
      const exercise = await exerciseRepo.findOne({
        where: { name: validExerciseName },
      });
      await exerciseRepo.remove(exercise);
    }
    app.use(cookieParser());
    await app.init();
  });

  describe('POST /api/workout-plans', () => {
    const path = '/api/workout-plans';

    it('should return 400 BAD REQUEST if body not sent', async () => {
      const response = await request(app.getHttpServer()).post(path);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 500 INTERNAL SERVER ERROR if username doesnt exist', async () => {
      const response = await request(app.getHttpServer())
        .post(path)
        .send({ title: 'FIrst entry!' });
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 400 BAD REQUEST if emptry title sent', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);
      const response = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: '' });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 201 CREATED if title sent', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);
      const response = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: 'My first workout!' });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('GET /api/workout-plans', () => {
    const path = '/api/workout-plans';

    it('should return 500 INTERNAL SERVER ERROR if user not in database', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 403 FORBIDDEN is user has no workout plans', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 200 OK is user has workout plans', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array<WorkoutPlanDto>);
    });
  });

  describe('GET /api/workout-plans/:id', () => {
    const path = '/api/workout-plans/';

    it('should return 500 INTERNAL SERVER ERROR if user not found', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 400 BAD REQUEST if id not found', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get(path + '-1')
        .set('jwtPayload', JSON.stringify(payload));

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 200 OK if user has one workout plan', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const response = await request(app.getHttpServer())
        .get(path + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('exercises');
      expect(response.body).toHaveProperty('dateAdded');
      expect(response.body).not.toHaveProperty(['user', 'username']);
    });
  });

  describe('POST /api/workout-plans/:id', () => {
    const path = '/api/workout-plans/';

    it('should return 400 BAD REQUEST if id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .post(path + 'a')
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 500 INTERNAL SERVER ERROR if id of workout plan not found', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(path + '-1')
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: 'Bench Press' });
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return BAD REQUEST when exercise name found found from WGER', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const response = await request(app.getHttpServer())
        .post(path + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: 'asdasfada' });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 201 CREATE response when exercise not in database, wger finds it and adds it to database', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const response = await request(app.getHttpServer())
        .post(path + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: validExerciseName });
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return 400 BAD REQUEST when exercise already in workout plan', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const response = await request(app.getHttpServer())
        .post(path + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: validExerciseName });
      expect(response.status).toBe(HttpStatus.CREATED);

      const addingSameExerciseResponse = await request(app.getHttpServer())
        .post(path + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: validExerciseName });
      expect(addingSameExerciseResponse.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /api/workout-plans', () => {
    const path = '/api/workout-plans/';

    it('should return 500 INTERNAL SERVER ERROR is user doesnt exist', async () => {
      const response = await request(app.getHttpServer())
        .delete(path)
        .send({ id: -1 })
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 403 FORBIDDEN is user has 0 workout plans', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(path)
        .send({ id: -1 })
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 500 INTERNAL SERVER ERROR is workout plan with given id not found', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(path)
        .send({ id: -1 })
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 204 NO CONTENT when workout successfully deleted', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(path)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const response = await request(app.getHttpServer())
        .delete(path)
        .send({ id: workoutPlans[0].id })
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /api/workout-plans/:id', () => {
    const deleteExerciseFromWorkoutPath = '/api/workout-plans/';

    it('should return 400 BAD REQUEST exercise name not passed', async () => {
      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + '1')
        .set({ jwtPayload: JSON.stringify(payload) });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 500 INTERNAL SERVER if exercise name passed, but user not found', async () => {
      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + '1')
        .send({ name: 'Bench Press' })
        .set({ jwtPayload: JSON.stringify(payload) });

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 403 FORBIDDEN is user has no workout plans', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + '1')
        .send({ name: 'Bench Press' })
        .set({ jwtPayload: JSON.stringify(payload) });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 500 INTERNAL SERVER ERROR is user has no workout plans', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + '-1')
        .send({ name: 'Bench Press' })
        .set({ jwtPayload: JSON.stringify(payload) });

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 403 FORBIDDEN is user has no exercises in workout plan', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + workoutPlans[0].id)
        .send({ name: 'Bench Press' })
        .set({ jwtPayload: JSON.stringify(payload) });
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 500 INTERNAL SERVER ERROR is user wants to delete exercise that doesnt exist in workout plan', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const createExerciseResponse = await request(app.getHttpServer())
        .post(deleteExerciseFromWorkoutPath + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: validExerciseName });
      expect(createExerciseResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + workoutPlans[0].id)
        .send({ name: 'Abdominal Stabilization' })
        .set({ jwtPayload: JSON.stringify(payload) });
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 204 NO CONTENT when user passes correct name that exists in workout plan', async () => {
      const registrationResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send({ username: username, password: password });
      expect(registrationResponse.status).toBe(HttpStatus.CREATED);

      const createWorkoutPlanResponse = await request(app.getHttpServer())
        .post(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: "Get movin'!" });
      expect(createWorkoutPlanResponse.status).toBe(HttpStatus.CREATED);

      const getAllWorkoutPlansResponse = await request(app.getHttpServer())
        .get(deleteExerciseFromWorkoutPath)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getAllWorkoutPlansResponse.status).toBe(HttpStatus.OK);

      const workoutPlans = plainToInstance(
        WorkoutPlanDto,
        getAllWorkoutPlansResponse.body,
      );

      const createExerciseResponse = await request(app.getHttpServer())
        .post(deleteExerciseFromWorkoutPath + workoutPlans[0].id)
        .set('jwtPayload', JSON.stringify(payload))
        .send({ name: validExerciseName });
      expect(createExerciseResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(deleteExerciseFromWorkoutPath + workoutPlans[0].id)
        .send({ name: validExerciseName })
        .set({ jwtPayload: JSON.stringify(payload) });
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
