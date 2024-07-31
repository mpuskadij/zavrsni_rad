import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { Payload } from '../../decorators/payload/payload.decorator';

@Controller('/api/workout-plans')
export class WorkoutPlanController {
  @Post()
  @UseGuards(JwtGuard)
  async createWorkoutPlan(@Payload('username') username: string): Promise<any> {
    return;
  }
}
