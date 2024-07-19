import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersController } from '../src/users/users/users.controller';

describe('GoogleRecaptchaGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [UsersController],
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
