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

describe('GoogleRecaptchaGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        GoogleRecaptchaModule.forRoot({
          secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: (req) => req.headers.recaptcha,
          score: 0.5,
        }),
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          entities: [User],
        }),
      ],
      controllers: [UsersController],
      providers: [GoogleRecaptchaGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (POST) should return 400 response when no recaptcha token is passed in header', () => {
    return request(app.getHttpServer()).post('/api/users').expect(400);
  });

  it('/api/users (POST) should return 400 response when invalid key is passed in header', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .set('recaptcha', '123')
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
