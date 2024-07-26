import { Test, TestingModule } from '@nestjs/testing';
import { BmiController } from '../src/bmi/bmi/bmi.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { UsersModule } from '../src/users/users.module';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersController } from '../src/users/users/users.controller';
import { Repository } from 'typeorm';
import { UsersService } from '../src/users/users-service/users-service';
import { CryptoService } from '../src/crpyto/crypto-service/crypto-service';
import { SaltGenerator } from '../src/crpyto/salt-generator/salt-generator';
import { HashGenerator } from '../src/crpyto/hash-generator/hash-generator';
import { HashedPasswordData } from '../src/crpyto/hashed-password-data/hashed-password-data';
import { AuthenticationService } from '../src/authentication/authentication-service/authentication-service';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { GuardsModule } from '../src/guards/guards.module';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { NewBmiEntryGuard } from '../src/guards/new-bmi-entry/new-bmi-entry.guard';
import { BmiService } from '../src/bmi/bmi-service/bmi-service';
import { BmiModule } from '../src/bmi/bmi.module';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
import { BmiEntryDto } from '../src/dtos/bmi-entry-dto/bmi-entry-dto';
import { DtosModule } from '../src/dtos/dtos.module';

describe('BmiController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  const username = 'marin';
  const password = 'ajskfnU7';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BmiModule,
        GuardsModule,
        DtosModule,
        UsersModule,
        CrpytoModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Bmientry],
        }),
        AuthenticationModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      controllers: [BmiController, UsersController],
      providers: [
        Repository<User>,
        Repository<Bmientry>,
        UsersService,
        CryptoService,
        SaltGenerator,
        HashGenerator,
        HashedPasswordData,
        AuthenticationService,
        JwtGuard,
      ],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .overrideGuard(JwtGuard)
      .useValue(true)
      .overrideGuard(NewBmiEntryGuard)
      .useValue(true)
      .compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  it('api/bmi (POST) should return 201 when user logged in', async () => {
    if ((await userRepo.existsBy({ username })) == true) {
      await userRepo.delete({ username });
    }
    const payload: JwtPayload = { username: username, isAdmin: 0 };
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: username, password: password });
    const loginResponse = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ username: username, password: password });
    return await request(app.getHttpServer())
      .post('/api/bmi')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ weight: 65, height: 1.8 })
      .expect(HttpStatus.CREATED);
  });

  it('/api/bmi (GET) should return 406 FORBIDDEN when user doesnt have at least 1 bmi entry', async () => {
    if ((await userRepo.existsBy({ username })) == true) {
      await userRepo.delete({ username });
    }
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: username, password: password });
    const loginResponse = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ username: username, password: password });
    return await request(app.getHttpServer())
      .get('/api/bmi')
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/api/bmi (GET) should return 200 OK when user has at least 1 bmi entry', async () => {
    if ((await userRepo.existsBy({ username })) == true) {
      await userRepo.delete({ username });
    }
    const payload: JwtPayload = { username: username, isAdmin: 0 };
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: username, password: password });
    await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ username: username, password: password });
    await request(app.getHttpServer())
      .post('/api/bmi')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ weight: 65, height: 1.8 });
    const response = await request(app.getHttpServer())
      .get('/api/bmi')
      .set('jwtPayload', JSON.stringify(payload));
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toBeInstanceOf(Array<BmiEntryDto>);
    console.log(response.body);
  });

  afterEach(async () => {
    await app.close();
  });
});
