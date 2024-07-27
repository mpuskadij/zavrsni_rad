import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { JournalController } from '../src/journal/journal/journal.controller';
import * as request from 'supertest';
import { after } from 'node:test';
import { User } from '../src/entities/user/user';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { GuardsModule } from '../src/guards/guards.module';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
import { UsersModule } from '../src/users/users.module';
import { JournalModule } from '../src/journal/journal.module';
import { UsersService } from '../src/users/users-service/users-service';
import { CrpytoModule } from '../src/crpyto/crpyto.module';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { AuthenticationService } from '../src/authentication/authentication-service/authentication-service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { Repository } from 'typeorm';
import { JournalEntryDto } from '../src/dtos/journal-entry-dto/journal-entry-dto';
import { DtosModule } from '../src/dtos/dtos.module';
describe('Journal Controller (e2e)', () => {
  let app: INestApplication;
  const username = 'marin';
  const password = 'ajskfnU7';
  const payload: JwtPayload = { username: username, isAdmin: 0 };
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DtosModule,
        GuardsModule,
        UsersModule,
        JournalModule,
        CrpytoModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [JournalEntry, User, Bmientry],
        }),
        TypeOrmModule.forFeature([JournalEntry, User, Bmientry]),
      ],
      controllers: [JournalController],
      providers: [
        UsersService,
        AuthenticationService,
        JwtService,
        ConfigService,
      ],
    })
      .overrideGuard(GoogleRecaptchaGuard)
      .useValue(true)
      .overrideGuard(JwtGuard)
      .useValue(true)
      .compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const userInDatabase: User = await userRepo.findOne({
      where: { username: username },
      relations: ['journalEntries', 'bmiEntries'],
    });
    if (userInDatabase != null) {
      await userRepo.remove(userInDatabase);
    }
    await app.init();
  });

  it('/api/journal (POST) should create a new journal entry when user enters the first journal entry and return 201', async () => {
    const user: User = new User();
    user.isAdmin = 0;
    user.password = password;
    user.username = username;
    await userRepo.save(user);
    return await request(app.getHttpServer())
      .post('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ title: 'My first entry :D', description: 'Boring...' })
      .expect(HttpStatus.CREATED);
  });

  it('/api/journal (POST) should return INTERNAL SERVER ERROR if user not in database', async () => {
    return await request(app.getHttpServer())
      .post('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ title: 'My first entry :D', description: 'Boring...' })
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('/api/journal (POST) should return 400 BAD REQUEST if title and description of journal entry not provided', async () => {
    return await request(app.getHttpServer())
      .post('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (POST) should  FORBIDDEN if user attempts to create 2 entries on same day', async () => {
    const user: User = new User();
    user.isAdmin = 0;
    user.password = password;
    user.username = username;
    await userRepo.save(user);
    await request(app.getHttpServer())
      .post('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ title: 'My first entry :D', description: 'Boring...' })
      .expect(HttpStatus.CREATED);

    return await request(app.getHttpServer())
      .post('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ title: 'My first entry same day :D', description: 'Boring...' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/api/journal (GET) should throw FORBIDDEN if user has no entries', async () => {
    const user: User = new User();
    user.isAdmin = 0;
    user.password = password;
    user.username = username;
    await userRepo.save(user);
    return await request(app.getHttpServer())
      .get('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/api/journal (GET) should throw INTERNAL SERVER ERROR if user not found', async () => {
    return await request(app.getHttpServer())
      .get('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('/api/journal (GET) should throw FORBIDDEN if user has no entries', async () => {
    const user: User = new User();
    user.isAdmin = 0;
    user.password = password;
    user.username = username;
    const entry: JournalEntry = new JournalEntry();
    entry.dateAdded = new Date();
    entry.description = 'asdasd';
    entry.title = 'First entry :D';
    user.journalEntries = new Array<JournalEntry>();
    user.journalEntries.push(entry);

    await userRepo.save(user);

    const response = await request(app.getHttpServer())
      .get('/api/journal')
      .set('jwtPayload', JSON.stringify(payload));
    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeInstanceOf(Array<JournalEntryDto>);
  });

  afterEach(async () => {
    await app.close();
  });
});
