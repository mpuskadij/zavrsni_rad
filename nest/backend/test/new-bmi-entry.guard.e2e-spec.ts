import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { BmiController } from '../src/bmi/bmi/bmi.controller';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { GuardsModule } from '../src/guards/guards.module';
import { NewBmiEntryGuard } from '../src/guards/new-bmi-entry/new-bmi-entry.guard';
import * as request from 'supertest';
import { BmiModule } from '../src/bmi/bmi.module';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { BmiService } from '../src/bmi/bmi-service/bmi-service';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { Food } from '../src/entities/food/food';
import { UserFood } from '../src/entities/user_food/user_food';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('NewBmiEntryGuard (e2e)', () => {
  let app: INestApplication;
  const path = '/api/bmi';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthenticationModule,
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
        GuardsModule,
        BmiModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
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
      ],
      controllers: [BmiController],
      providers: [NewBmiEntryGuard, JwtGuard, WorkoutPlan],
    })
      .overrideGuard(JwtGuard)
      .useValue(true)
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('should return 400 Bad Request if weight not passed', async () => {
    const body = { height: 180 };
    return request(app.getHttpServer()).post(path).send(body).expect(400);
  });

  it('should return 400 Bad Request if height not passed', async () => {
    const body = { weight: 180 };
    return request(app.getHttpServer()).post(path).send(body).expect(400);
  });

  it('should return 400 Bad Request when body is empty', async () => {
    return request(app.getHttpServer()).post(path).expect(400);
  });

  it('should return 406 NO ACCEPTABLE if height == 0', async () => {
    const body = { weight: 180, height: 0 };
    return request(app.getHttpServer()).post(path).send(body).expect(406);
  });

  afterEach(async () => {
    await app.close();
  });
});
