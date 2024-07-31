import { Type } from 'class-transformer';
import { WgerExerciseDto } from '../wger-exercise-dto/wger-exercise-dto';

export class WgerExerciseResultDto {
  count: number;
  previous: string | null;
  next: string | null;

  @Type(() => WgerExerciseDto)
  results: WgerExerciseDto[];
}
