import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersController } from '../src/users/users/users.controller';
import { CryptoService } from '../src/crpyto/crypto-service/crypto-service';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import {
  GoogleRecaptchaGuard,
  GoogleRecaptchaModule,
} from '@nestlab/google-recaptcha';
import { ConfigModule } from '@nestjs/config';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { Food } from '../src/entities/food/food';
import { UserFood } from '../src/entities/user_food/user_food';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';

describe('GoogleRecaptchaGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CrpytoModule,
        AuthenticationModule,
        ConfigModule.forRoot(),
        GoogleRecaptchaModule.forRoot({
          secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: (req) => req.headers.recaptcha,
          score: 0.5,
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
        UsersModule,
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
      ],
      controllers: [UsersController],
      providers: [GoogleRecaptchaGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/users/register (POST) should return 400 response when no recaptcha token is passed in header', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .expect(400);
  });

  it('/api/users/register (POST) should return 400 response when invalid key is passed in header', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .set('recaptcha', '123')
      .expect(400);
  });

  it('/api/users/login (POST) should return 400 response when no recaptcha token is passed in header', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/login')
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
