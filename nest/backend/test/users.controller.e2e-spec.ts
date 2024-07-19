import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersController } from '../src/users/users/users.controller';
import { UsersService } from '../src/users/users-service/users-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entities/user/user';
import { UsersModule } from '../src/users/users.module';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<User>;
  let usersService: UsersService;

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
      controllers: [],
      providers: [Repository, UsersService],
    }).compile();
    repo = moduleFixture.get<Repository<User>>(Repository<User>);
    usersService = moduleFixture.get<UsersService>(UsersService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (POST) should return 409 response when username already in database', async () => {
    const userCredentials = { username: 'marin', password: 'jgklsmhM3' };
    let userAlreadyExists: boolean =
      await usersService.checkIfUsernameIsAlreadyInDatabase(
        userCredentials.username,
      );
    if (userAlreadyExists == false) {
      const user = repo.create({
        isAdmin: 0,
        password: userCredentials.password,
        username: userCredentials.username,
      });
      await repo.insert(user);
    }
    return request(app.getHttpServer())
      .post('/api/users')
      .send(userCredentials)
      .expect(409);
  });

  it('/api/users (POST) should add user into database and return 201 when username not in database', async () => {
    const userCredentials = { username: 'marin', password: 'jgklsmhM3' };
    let userAlreadyExists: boolean =
      await usersService.checkIfUsernameIsAlreadyInDatabase(
        userCredentials.username,
      );
    if (userAlreadyExists == true) {
      await repo.delete(userCredentials.username);
    }
    return request(app.getHttpServer())
      .post('/api/users')
      .send(userCredentials)
      .expect(201);
  });

  afterEach(async () => {
    await app.close();
  });
});
