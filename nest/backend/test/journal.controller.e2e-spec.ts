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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { Repository } from 'typeorm';
import { JournalEntryDto } from '../src/dtos/journal-entry-dto/journal-entry-dto';
import { DtosModule } from '../src/dtos/dtos.module';
import { WorkoutPlan } from '../src/entities/workout-plan/workout-plan';
import { Exercise } from '../src/entities/exercise/exercise';
import { Food } from '../src/entities/food/food';
import { UserFood } from '../src/entities/user_food/user_food';
import { AdminModule } from '../src/admin/admin.module';
import { VirtualTimeService } from '../src/admin/virtual-time-service/virtual-time-service';

describe('Journal Controller (e2e)', () => {
  let app: INestApplication;
  const username = 'marin';
  const password = 'ajskfnU7';
  const payload: JwtPayload = { username: username, isAdmin: false };
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AdminModule,
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
          entities: [
            JournalEntry,
            User,
            Bmientry,
            WorkoutPlan,
            Exercise,
            Food,
            UserFood,
          ],
        }),
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        TypeOrmModule.forFeature([
          JournalEntry,
          User,
          Bmientry,
          WorkoutPlan,
          Exercise,
          Food,
          UserFood,
        ]),
      ],
      controllers: [JournalController],
      providers: [
        UsersService,
        AuthenticationService,
        JwtService,
        ConfigService,
        VirtualTimeService,
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
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/journal (POST) should create a new journal entry when user enters the first journal entry and return 201', async () => {
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: username, password: password });
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
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({ username: username, password: password });
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
    user.isAdmin = false;
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
    user.isAdmin = false;
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

  it('/api/journal (PUT) should throw BAD REQUEST if body is empty', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if title not passed', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({ description: 'Boring', dateAdded: new Date() })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if title empty string', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        title: '',
        description: 'Boring',
        dateAdded: new Date().toDateString(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if title bigger than 50 characters', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        title: 'VPUfFHj7h95GEjhVQ4PZ67YmiQIq5O7tbQ3RVOdU2XR9AhzdvIx',
        description: 'Boring',
        dateAdded: new Date().toDateString(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if description empty', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        title: 'Bad day',
        description: '',
        dateAdded: new Date().toDateString(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if description not passed', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        title: 'Bad day',
        dateAdded: new Date().toDateString(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if date not passed', async () => {
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        title: 'Bad day',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/api/journal (PUT) should throw BAD REQUEST if date is in the future', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        title: 'Bad day',
        description: 'It was bad...',
        dateAdded: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      });
    expect(response.text).toContain(
      'Journal entry date cannot be in the future!',
    );
  });

  it('/api/journal (PUT) should return INTERNAL SERVER ERROR if user not found', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        dateAdded: new Date().toDateString(),
        title: 'First day',
        description: 'Boring D:',
      });
    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('/api/journal (PUT) should return FORBIDDEN EXCEPTION user has 0 journal entries', async () => {
    const user: User = new User();
    user.username = username;
    user.password = password;
    user.isAdmin = false;
    await userRepo.save(user);
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        dateAdded: new Date().toDateString(),
        title: 'First day',
        description: 'Boring D:',
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/api/journal (PUT) should return BAD REQUEST if entry with sent date doesnt exist', async () => {
    const user: User = new User();
    user.password = password;
    user.isAdmin = false;
    user.username = username;
    user.journalEntries = [];
    await userRepo.save(user);
    const journalEntry: JournalEntry = new JournalEntry();
    journalEntry.dateAdded = new Date();
    journalEntry.description = 'Boring...';
    journalEntry.title = 'First day!';
    user.journalEntries.push(journalEntry);
    await userRepo.save(user);
    return await request(app.getHttpServer())
      .put('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .send({
        dateAdded: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000,
        ).toDateString(),
        title: 'First day',
        description: 'Boring D:',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  describe('DELETE /api/journal', () => {
    const title = 'First day!';
    const description = 'Bad';
    const dateAdded = new Date();
    it('should return 400 BAD REQUEST if no body was sent', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/journal')
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if date in the future', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/journal')
        .set('jwtPayload', JSON.stringify(payload))
        .send({
          dateAdded: new Date(
            Date.now() + 1 * 24 * 60 * 60 * 1000,
          ).toDateString(),
        });
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return 500 INTERNAL SERVER ERROR if user not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/journal')
        .set('jwtPayload', JSON.stringify(payload))
        .send({
          dateAdded: new Date().toDateString(),
        });
      expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return 403 FORBIDDEN if user has 0 entries', async () => {
      const register = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({ username: username, password: password });
      expect(register.status).toEqual(HttpStatus.CREATED);
      const response = await request(app.getHttpServer())
        .delete('/api/journal')
        .set('jwtPayload', JSON.stringify(payload))
        .send({
          dateAdded: new Date().toDateString(),
        });
      expect(response.status).toEqual(HttpStatus.FORBIDDEN);
    });

    it('should return 400 BAD REQUEST if entry exists, but wrong date was sent', async () => {
      const register = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({ username: username, password: password });
      expect(register.status).toEqual(HttpStatus.CREATED);
      await request(app.getHttpServer())
        .post('/api/journal')
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: title, description: description });
      const response = await request(app.getHttpServer())
        .delete('/api/journal')
        .send({
          dateAdded: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          ).toDateString(),
        });
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return 204 NO CONTENT if entry exists and correct date was sent', async () => {
      const register = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({ username: username, password: password });

      expect(register.status).toEqual(HttpStatus.CREATED);

      const createEntry = await request(app.getHttpServer())
        .post('/api/journal')
        .set('jwtPayload', JSON.stringify(payload))
        .send({ title: title, description: description });

      expect(createEntry.status).toEqual(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .delete('/api/journal')
        .set('jwtPayload', JSON.stringify(payload))
        .send({
          dateAdded: new Date().toDateString(),
        });
      expect(response.status).toEqual(HttpStatus.NO_CONTENT);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
