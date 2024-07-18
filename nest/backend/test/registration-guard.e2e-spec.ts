import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RegistrationGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
