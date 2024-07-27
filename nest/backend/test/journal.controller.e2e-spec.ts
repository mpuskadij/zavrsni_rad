import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from '../src/entities/journal-entry/journal-entry';
import { JournalController } from '../src/journal/journal/journal.controller';
import * as request from 'supertest';
import { after } from 'node:test';
import { User } from '../src/entities/user/user';
import { Bmientry } from '../src/entities/bmientry/bmientry';
import { GuardsModule } from '../src/guards/guards.module';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
describe('Journal Controller (e2e)', () => {
  let app: INestApplication;
  const username = 'marin';
  const password = 'ajskfnU7';
  const payload: JwtPayload = { username: username, isAdmin: 0 };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GuardsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          autoLoadEntities: true,
          entities: [JournalEntry, User, Bmientry],
        }),
      ],
      controllers: [JournalController],
      providers: [],
    })
      .overrideGuard(JwtGuard)
      .useValue(true)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/journal (POST) should create a new journal entry when user enters the first journal entry and return 201', async () => {
    return await request(app.getHttpServer())
      .post('/api/journal')
      .set('jwtPayload', JSON.stringify(payload))
      .expect(HttpStatus.CREATED);
  });

  afterEach(async () => {
    await app.close();
  });
});
