import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanModule } from '../src/workout-plan/workout-plan.module';
import { ExerciseController } from '../src/workout-plan/exercise/exercise.controller';
import * as request from 'supertest';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { GuardsModule } from '../src/guards/guards.module';
import { WgerExerciseDto } from '../src/dtos/wger-variaton-dto/wger-variaton-dto';
import { DtosModule } from '../src/dtos/dtos.module';
import { WgerService } from '../src/workout-plan/wger-service/wger-service';

describe('Exercise controller (e2e)', () => {
  let app: INestApplication;
  const username = 'marin';
  const payload: JwtPayload = { isAdmin: 0, username: username };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WorkoutPlanModule,
        AuthenticationModule,
        GuardsModule,
        DtosModule,
      ],
      controllers: [ExerciseController],
      providers: [WgerService],
    })
      .overrideGuard(JwtGuard)
      .useValue(true)
      .compile();

    app = module.createNestApplication();

    await app.init();
  });

  describe('GET /api/exercise', () => {
    const path = '/api/exercise';

    it('should return 400 BAD REQUEST if no query passed', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if page is 0', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 0 });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if page is not a number', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 'sdas' });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if page is decimal', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 1.2 });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 BAD REQUEST if page too high', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 999 });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 200 OK if correct page sent', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 1 });
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return 200 OK and different exercises if different pages sent', async () => {
      const responseFirstPage = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 1 });

      const responseSecondPage = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 2 });

      expect(responseFirstPage.body).not.toEqual(responseSecondPage.body);
    });

    it('should return 200 OK with exercises that target abs on first page', async () => {
      const responseFirstPage = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload))
        .query({ page: 1, category: 'Abs' });
      expect(responseFirstPage.status).toBe(HttpStatus.OK);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
