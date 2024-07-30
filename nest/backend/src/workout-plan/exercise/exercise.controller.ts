import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { SearchExerciseDto } from '../../dtos/search-exercise-dto/search-exercise-dto';

@Controller('api/exercise')
export class ExerciseController {
  @Get()
  @UseGuards(JwtGuard)
  async getExercise(
    @Query(new ValidationPipe({ transform: true }))
    searchExercise: SearchExerciseDto,
  ): Promise<any> {}
}
