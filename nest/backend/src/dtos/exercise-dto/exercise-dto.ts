import { Exclude } from 'class-transformer';

export class ExerciseDto {
  @Exclude()
  id: number;

  name: string;

  description: string;

  category: string;

  equipment: string;
}
