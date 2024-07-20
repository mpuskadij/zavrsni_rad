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
          entities: [User],
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
    await app.init();
  });

  it('/api/users (POST) should return NOT_ACCEPTABLE HTTP response when no body is passed', () => {
    return request(app.getHttpServer()).post('/api/users').expect(406);
  });

  afterEach(async () => {
    await app.close();
  });
});
