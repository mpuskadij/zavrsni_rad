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
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { WorkoutPlanController } from '../src/workout-plan/workout-plan/workout-plan.controller';

describe('BmiController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  const username = 'marin';
  const password = 'ajskfnU7';
  const payload: JwtPayload = { username: username, isAdmin: 0 };

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
          entities: [User, Bmientry, JournalEntry, WorkoutPlan, Exercise],
        }),
        AuthenticationModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      controllers: [BmiController, UsersController, WorkoutPlanController],
      providers: [
        Repository<User>,
        Repository<Bmientry>,
        Repository<JournalEntry>,
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

    if ((await userRepo.existsBy({ username })) == true) {
      const user = await userRepo.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      await userRepo.remove(user);
    }
    await app.init();
  });

  describe('POST /api/workout-plans', () => {
    const path = '/api/workout-plans';
    it('should return 400 BAD REQUEST if body not sent', async () => {
      const response = await request(app.getHttpServer()).post(path);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 401 UNATHORIZED if user not logged in', async () => {
      const response = await request(app.getHttpServer())
        .post(path)
        .send({ title: 'My first workout!' });
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
