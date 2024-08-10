import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
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

describe.skip('Food Controller (e2e tests)', () => {
  let app: INestApplication;
  const searchFoodPath = '/api/food';
  const foodDetailsPath = searchFoodPath + '/details';
  const registrationPath = '/api/users/register';
  const username = 'marin';
  const password = 'ajskfnU7';
  const registrationRequestBody = { username: username, password: password };

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      imports: [
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
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      controllers: [FoodController],
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

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET ' + searchFoodPath, () => {
    it('should return 400 BAD REQUEST if search term not provided', async () => {
      const response = await request(app.getHttpServer()).get(searchFoodPath);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if food matching search term not found', async () => {
      const response = await request(app.getHttpServer())
        .get(searchFoodPath)
        .query({ searchTerm: 'sdasfasfasfa' });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 200 OK if food matching search term is found', async () => {
      const response = await request(app.getHttpServer())
        .get(searchFoodPath)
        .query({ searchTerm: 'hamburger' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('common');
      expect(response.body).toHaveProperty('branded');
    });
  });

  describe('GET ' + foodDetailsPath, () => {
    it('should return 400 BAD REQUEST if no query parameters passed', async () => {
      const response = await request(app.getHttpServer()).get(foodDetailsPath);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 503 SERVICE UNAVAILABLE if invalid common food name', async () => {
      const response = await request(app.getHttpServer())
        .get(foodDetailsPath)
        .query({ name: 'asdasdasdasdas' });

      expect(response.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    });

    it('should return 503 SERVICE UNAVAILABLE if invalid brand food id', async () => {
      const response = await request(app.getHttpServer())
        .get(foodDetailsPath)
        .query({ id: 'adswr435efd' });

      expect(response.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    });

    it('should return 200 OK if valid common food name', async () => {
      const response = await request(app.getHttpServer())
        .get(foodDetailsPath)
        .query({ name: 'hamburger' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
    });

    it('should return 200 OK if valid brand food id', async () => {
      const response = await request(app.getHttpServer())
        .get(foodDetailsPath)
        .query({ id: '51c549ff97c3e6efadd60294' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeDefined();
    });

    it('should return 400 BAD REQUEST if both name and id passed', async () => {
      const response = await request(app.getHttpServer())
        .get(foodDetailsPath)
        .query({ id: '51c549ff97c3e6efadd60294', name: 'hamburger' });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
