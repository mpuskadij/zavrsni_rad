import {
  Controller,
  Get,
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

@Controller('/api/workout-plans')
export class WorkoutPlanController {
  constructor(
    private workoutPlanService: WorkoutPlanService,
    private usersService: UsersService,
  ) {}
  @Post()
  @UseGuards(JwtGuard)
  async createWorkoutPlan(
    @Payload('username') username: string,
    @Query(new ValidationPipe({ transform: true }))
    createWorkoutPlanData: CreateWorkoutPlanDto,
  ): Promise<any> {
    const workoutPlan: WorkoutPlan =
      await this.workoutPlanService.createWorkoutPlan(
        createWorkoutPlanData.title,
      );
    const user = await this.usersService.getUser(username);
    await this.usersService.assignWorkoutPlan(user, workoutPlan);
    return;
  }
}
