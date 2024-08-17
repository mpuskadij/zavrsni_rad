import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { plainToInstance } from 'class-transformer';
import { GetFoodDto } from 'src/dtos/get-food-dto/get-food-dto';

describe('Nutrition Controller (e2e tests)', () => {
  let app: INestApplication;
  const nutritionPath = '/api/nutrition';
  let userRepository: Repository<User>;
  const correctNixId = '51c549ff97c3e6efadd60294';
  const registrationPath = '/api/users/register';
  let foodRepository: Repository<Food>;
  const username = 'marin';
  const password = 'ajskfnU7';
  const payload: JwtPayload = { isAdmin: false, username: username };

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
        Repository<Food>,
        UsersService,
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
    app.setGlobalPrefix('api');
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    const user = await userRepository.findOne({
      where: { username: username },
      relations: ['bmiEntries', 'journalEntries', 'workoutPlans', 'userFoods'],
    });
    if (user != null) {
      await userRepository.remove(user);
    }

    foodRepository = module.get<Repository<Food>>(getRepositoryToken(Food));

    const food = await foodRepository.findOne({
      where: { nixId: correctNixId },
      relations: ['userFoods'],
    });
    if (food) {
      await foodRepository.remove(food);
    }
    await app.init();
  });

  describe.skip('POST ' + nutritionPath, () => {
    it('should return 400 BAD REQUEST if no body passed', async () => {
      const response = await request(app.getHttpServer()).post(nutritionPath);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if both id and name passed', async () => {
      const response = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ id: '3', name: 'hamburger' });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 503 SERVICE UNAVAILABLE if id not in database and nutritionix fails to get branded food', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ id: '3' })
        .set('jwtPayload', JSON.stringify(payload));

      expect(response.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    });

    it('should return 201 CREATED when branded food added and linked to user', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ id: correctNixId })
        .set('jwtPayload', JSON.stringify(payload));

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return 403 FORBIDDEN when user has branded food in nutrition', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ id: correctNixId })
        .set('jwtPayload', JSON.stringify(payload));

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseAgain = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ id: correctNixId })
        .set('jwtPayload', JSON.stringify(payload));

      expect(responseAgain.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 403 FORBIDDEN when commond food with same nutritional value already in nutrition', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ name: 'hamburger' })
        .set('jwtPayload', JSON.stringify(payload));

      expect(response.status).toBe(HttpStatus.CREATED);

      const responseAgain = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ name: 'hamburger' })
        .set('jwtPayload', JSON.stringify(payload));

      expect(responseAgain.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should return 201 CREATED when commond food with name added and linked to user', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ name: 'hamburger' })
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('DELETE ' + nutritionPath + '/:id', () => {
    it('should return 400 BAD REQUEST if id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .delete(nutritionPath + '/1.2')
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 403 FORBIDDEN if user has no food to delete', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(nutritionPath + '/1')
        .set('jwtPayload', JSON.stringify(payload));

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it.skip('should return 400 BAD REQUEST if id not found', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const addFoodResponse = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ name: 'hamburger' })
        .set('jwtPayload', JSON.stringify(payload));
      expect(addFoodResponse.status).toBe(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete(nutritionPath + '/-1')
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it.skip('should return 204 if food found and deleted', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post(registrationPath)
        .send(registrationRequestBody);

      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      const addFoodResponse = await request(app.getHttpServer())
        .post(nutritionPath)
        .send({ name: 'hamburger' })
        .set('jwtPayload', JSON.stringify(payload));
      expect(addFoodResponse.status).toBe(HttpStatus.CREATED);

      const getFoodResponse = await request(app.getHttpServer())
        .get(nutritionPath)
        .set('jwtPayload', JSON.stringify(payload));
      expect(getFoodResponse.status).toBe(HttpStatus.OK);

      const foods = plainToInstance(Array<GetFoodDto>, getFoodResponse.body);
      const response = await request(app.getHttpServer())
        .delete(nutritionPath + '/' + foods[0].id)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
