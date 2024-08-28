import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { AuthenticationService } from '../src/authentication/authentication-service/authentication-service';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { BmiModule } from '../src/bmi/bmi.module';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { CryptoService } from '../src/crpyto/crypto-service/crypto-service';
import { HashGenerator } from '../src/crpyto/hash-generator/hash-generator';
import { HashedPasswordData } from '../src/crpyto/hashed-password-data/hashed-password-data';
import { SaltGenerator } from '../src/crpyto/salt-generator/salt-generator';
import { DtosModule } from '../src/dtos/dtos.module';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { Exercise } from '../src/entities/exercise/exercise';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { User } from '../src/entities/user/user';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { GuardsModule } from '../src/guards/guards.module';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { NewBmiEntryGuard } from '../src/guards/new-bmi-entry/new-bmi-entry.guard';
import { UsersService } from '../src/users/users-service/users-service';
import { UsersModule } from '../src/users/users.module';
import { UsersController } from '../src/users/users/users.controller';
import { ExerciseService } from '../src/workout-plan/exercise-service/exercise-service';
import { WgerService } from '../src/workout-plan/wger-service/wger-service';
import { WorkoutPlanService } from '../src/workout-plan/workout-plan-service/workout-plan-service';
import { WorkoutPlanModule } from '../src/workout-plan/workout-plan.module';
import { WorkoutPlanController } from '../src/workout-plan/workout-plan/workout-plan.controller';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { NutritionModule } from '../src/nutrition/nutrition.module';
import { FoodController } from '../src/nutrition/food/food.controller';
import { NutritionixInstantEndpointResponseDto } from '../src/dtos/nutritionix-instant-endpoint-response-dto/nutritionix-instant-endpoint-response-dto';
import { UserFood } from '../src/entities/user_food/user_food';
import { Food } from '../src/entities/food/food';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
import { AdminModule } from '../src/admin/admin.module';
import { AdminGuard } from '../src/guards/admin/admin.guard';
import { TimeDto } from '../src/dtos/time-dto/time-dto';

describe('Time Controller (e2e tests)', () => {
  let app: INestApplication;
  const timePath = '/api/time';
  let userRepository: Repository<User>;
  const username = 'marin';
  const password = 'ajskfnU7';

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      imports: [
        AdminModule,
        NutritionModule,
        GuardsModule,
        DtosModule,
        UsersModule,
        CrpytoModule,
        ConfigModule.forRoot(),
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
            UserFood,
            Food,
          ],
        }),
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        TypeOrmModule.forFeature([
          User,
          Bmientry,
          JournalEntry,
          WorkoutPlan,
          Exercise,
          UserFood,
          Food,
        ]),
        AuthenticationModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [FoodController],
      providers: [
        Repository<User>,
        Repository<Bmientry>,
        Repository<JournalEntry>,
        Repository<Exercise>,
        Repository<Food>,
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
        ConfigService,
      ],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .overrideGuard(JwtGuard)
      .useValue(true)
      .overrideGuard(NewBmiEntryGuard)
      .useValue(true)
      .overrideGuard(AdminGuard)
      .useValue(true)
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  describe('GET ' + timePath, () => {
    it('should return 200 OK and server time when activated', async () => {
      const response = await request(app.getHttpServer()).get(timePath);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('time');
    });
  });

  describe('PUT ' + timePath, () => {
    it('should return 200 OK and body should contain new time when activated', async () => {
      const response = await request(app.getHttpServer())
        .put(timePath)
        .send({ offset: 12 });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
    });

    it('should return 200 OK when negative integer passed', async () => {
      const response = await request(app.getHttpServer())
        .put(timePath)
        .send({ offset: -12 });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
    });

    it('should return 200 OK when 0 passed', async () => {
      const response = await request(app.getHttpServer())
        .put(timePath)
        .send({ offset: 0 });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
    });

    it('should return 400 BAD REQUEST when no body passed', async () => {
      const response = await request(app.getHttpServer()).put(timePath);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST when float passed', async () => {
      const response = await request(app.getHttpServer())
        .put(timePath)
        .send({ offset: 1.2 });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
