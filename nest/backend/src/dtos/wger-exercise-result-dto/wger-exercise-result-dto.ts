import { Type } from 'class-transformer';
import { WgerExerciseDto } from '../wger-variaton-dto/wger-variaton-dto';

export class WgerExerciseResultDto {
  count: number;
  previous: string | null;
  next: string | null;

  @Type(() => WgerExerciseDto)
  results: WgerExerciseDto[];
}
