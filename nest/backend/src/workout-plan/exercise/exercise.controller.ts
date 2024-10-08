import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { SearchExerciseDto } from '../../dtos/search-exercise-dto/search-exercise-dto';
import { WgerService } from '../wger-service/wger-service';
import { WgerExerciseDto } from '../../dtos/wger-exercise-dto/wger-exercise-dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private wgerService: WgerService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getExercise(
    @Query(new ValidationPipe({ transform: true }))
    searchExercise: SearchExerciseDto,
  ): Promise<any> {
    const exercisesFromExternalApi: WgerExerciseDto[] =
      await this.wgerService.getExercises(
        searchExercise.page,
        searchExercise.searchTerm,
        searchExercise.category,
        searchExercise.equipment,
      );
    return exercisesFromExternalApi;
  }
}
