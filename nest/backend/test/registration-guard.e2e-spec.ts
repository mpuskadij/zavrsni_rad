import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersController } from '../src/users/users/users.controller';
import {
  GoogleRecaptchaGuard,
  GoogleRecaptchaModule,
} from '@nestlab/google-recaptcha';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from '../src/users/users-service/users-service';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { UsersModule } from '../src/users/users.module';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { CryptoService } from '../src/crpyto/crypto-service/crypto-service';
import { SaltGenerator } from '../src/crpyto/salt-generator/salt-generator';
import { HashGenerator } from '../src/crpyto/hash-generator/hash-generator';
import { HashedPasswordData } from '../src/crpyto/hashed-password-data/hashed-password-data';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { Food } from '../src/entities/food/food';
import { UserFood } from '../src/entities/user_food/user_food';
import { JwtModule } from '@nestjs/jwt';

describe('RegistrationGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        CrpytoModule,
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
        AuthenticationModule,
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        Repository<User>,
        CryptoService,
        SaltGenerator,
        HashGenerator,
        HashedPasswordData,
      ],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when no body is passed', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when no username sent', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: '', password: 'sadksg6H' })
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when no password sent', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: 'marin', password: '' })
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when username length < 5', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: 'mari', password: 'mghkzi8H' })
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when username length > 25', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: 'qwertzuioplkjhgfdsayxcvbnm', password: 'mghkzi8H' })
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when password length < 8', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: 'marin', password: 'mghkzi8' })
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when password length doesnt have number', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: 'marin', password: 'mghkzikg' })
      .expect(406);
  });

  it('/api/users/register (POST) should return NOT_ACCEPTABLE HTTP response when password length doesnt have uppercase character', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: 'marin', password: 'mghkzikg12' })
      .expect(406);
  });

  it('/api/users/login (POST) should use RegistrationGuard for username and password', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/login')
      .expect(406);
  });

  afterEach(async () => {
    await app.close();
  });
});
