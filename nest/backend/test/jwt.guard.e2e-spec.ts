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

describe('JWTGuard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        AuthenticationModule,
        BmiModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      controllers: [],
      providers: [JwtGuard, AuthenticationService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return 401 when no jwt token passed', () => {
    return request(app.getHttpServer()).post('/api/bmi').expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
