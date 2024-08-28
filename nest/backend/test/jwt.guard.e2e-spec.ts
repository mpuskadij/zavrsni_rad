import { Test, TestingModule } from '@nestjs/testing';
import { BmiController } from '../src/bmi/bmi/bmi.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { BmiModule } from '../src/bmi/bmi.module';
import { AuthenticationService } from '../src/authentication/authentication-service/authentication-service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { UsersModule } from '../src/users/users.module';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { Food } from '../src/entities/food/food';
import { UserFood } from '../src/entities/user_food/user_food';

describe('JWTGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        AuthenticationModule,
        BmiModule,
        UsersModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
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
      controllers: [],
      providers: [JwtGuard, AuthenticationService],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('should return 401 when no jwt token passed', async () => {
    return await request(app.getHttpServer()).post('/api/bmi').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
