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

describe('RegistrationGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          entities: [User],
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, Repository<User>],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (POST) should return NOT_ACCEPTABLE HTTP response when no body is passed', () => {
    return request(app.getHttpServer()).post('/api/users').expect(406);
  });

  afterEach(async () => {
    await app.close();
  });
});
