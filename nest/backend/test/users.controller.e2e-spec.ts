import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersController } from '../src/users/users/users.controller';
import { UsersService } from '../src/users/users-service/users-service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { UsersModule } from '../src/users/users.module';
import { Repository } from 'typeorm';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { CryptoService } from '../src/crpyto/crypto-service/crypto-service';
import { SaltGenerator } from '../src/crpyto/salt-generator/salt-generator';
import { HashGenerator } from '../src/crpyto/hash-generator/hash-generator';
import { HashedPasswordData } from '../src/crpyto/hashed-password-data/hashed-password-data';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import * as cookieParser from 'cookie-parser';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from '../src/authentication/authentication-service/authentication-service';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  let repo: Repository<User>;
  let usersService: UsersService;
  const username = 'marin';
  const password = 'ajskfnU7';
  const userCredentials = { username: username, password: password };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        CrpytoModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [User, Bmientry, JournalEntry, WorkoutPlan, Exercise],
        }),
        AuthenticationModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      controllers: [UsersController],
      providers: [
        Repository<User>,
        UsersService,
        CryptoService,
        SaltGenerator,
        HashGenerator,
        HashedPasswordData,
        AuthenticationService,
      ],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .compile();
    repo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    usersService = moduleFixture.get<UsersService>(UsersService);
    let userInDatabase = await repo.findOne({
      where: { username: username },
      relations: ['bmiEntries', 'journalEntries'],
    });
    if (userInDatabase) {
      await repo.remove(userInDatabase);
    }
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('/api/users/register (POST) should return 409 response when username already in database', async () => {
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send(userCredentials);

    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send(userCredentials)
      .expect(409);
  });

  it('/api/users/register (POST) should add user into database and return 201 when username not in database', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/register')
      .send(userCredentials)
      .expect(HttpStatus.CREATED);
  });

  it('/api/users/login (POST) should return 400 when username not recognized in database', async () => {
    return await request(app.getHttpServer())
      .post('/api/users/login')
      .send(userCredentials)
      .expect(401);
  });

  it('/api/users/login (POST) should return 200 with correct username and password after /api/users/register', async () => {
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send(userCredentials);

    return await request(app.getHttpServer())
      .post('/api/users/login')
      .send(userCredentials)
      .expect(HttpStatus.OK);
  });

  it('/api/users/login (POST) should return 400 HTTP response with correct username,but incorrect password after /api/users/register', async () => {
    const userCredentials = { username: username, password: password };
    const invalidUserCredentials = {
      username: username,
      password: password + 's',
    };
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send(userCredentials);

    return await request(app.getHttpServer())
      .post('/api/users/login')
      .send(invalidUserCredentials)
      .expect(401);
  });

  it('/api/users/register (POST) should return 200 with jwt in cookie', async () => {
    const userCredentials = { username: username, password: password };
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send(userCredentials);

    return await request(app.getHttpServer())
      .post('/api/users/login')
      .send(userCredentials)
      .expect((response) => {
        expect(response.headers['set-cookie']).toBeDefined();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
