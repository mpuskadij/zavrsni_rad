import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanModule } from '../src/workout-plan/workout-plan.module';
import { ExerciseController } from '../src/workout-plan/exercise/exercise.controller';
import * as request from 'supertest';
import { JwtPayload } from '../src/authentication/jwt-payload/jwt-payload';
import { AuthenticationModule } from '../src/authentication/authentication.module';
import { JwtGuard } from '../src/guards/jwt/jwt.guard';
import { GuardsModule } from '../src/guards/guards.module';

describe('Exercise controller (e2e)', () => {
  let app: INestApplication;
  const username = 'marin';
  const payload: JwtPayload = { isAdmin: 0, username: username };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WorkoutPlanModule, AuthenticationModule, GuardsModule],
      controllers: [ExerciseController],
    })
      .overrideGuard(JwtGuard)
      .useValue(true)
      .compile();

    app = module.createNestApplication();

    await app.init();
  });

  describe('GET /api/exercise', () => {
    const path = '/api/exercise';
    it('should return 400 BAD REQUEST if no query parameters passed', async () => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('jwtPayload', JSON.stringify(payload));
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
