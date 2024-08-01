import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { Payload } from '../../decorators/payload/payload.decorator';
import { CreateWorkoutPlanDto } from '../../dtos/create-workout-plan-dto/create-workout-plan-dto';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { UsersService } from '../../users/users-service/users-service';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan-service';
import { User } from 'src/entities/user/user';
import { plainToInstance } from 'class-transformer';
import { WorkoutPlanDto } from '../../dtos/workout-plan-dto/workout-plan-dto';

@Controller('/api/workout-plans')
export class WorkoutPlanController {
  constructor(
    private workoutPlanService: WorkoutPlanService,
    private usersService: UsersService,
  ) {}
  @Get()
  @UseGuards(JwtGuard)
  async findAllPlans(@Payload('username') username: string): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('Error finding user!');
    }
    const workoutPlans: WorkoutPlan[] =
      await this.usersService.getWorkoutsFromUser(user);

    return plainToInstance(WorkoutPlanDto, workoutPlans);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createWorkoutPlan(
    @Payload('username') username: string,
    @Body(new ValidationPipe({ transform: true }))
    createWorkoutPlanData: CreateWorkoutPlanDto,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('User not found!');
    }
    const workoutPlan: WorkoutPlan =
      await this.workoutPlanService.createWorkoutPlan(
        createWorkoutPlanData.title,
      );
    await this.usersService.assignWorkoutPlan(user, workoutPlan);
    return;
  }

  @Post('/:id')
  @UseGuards(JwtGuard)
  async addExerciseToPlan(
    @Param(
      'id',
      new ParseIntPipe({
        optional: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: number,
    @Payload('username') username: string,
  ): Promise<any> {
    return;
  }
}
