import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';

@Controller('api/exercise')
export class ExerciseController {
  @Get()
  @UseGuards(JwtGuard)
  async getExercise(): Promise<any> {}
}
