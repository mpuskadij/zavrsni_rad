import { Exclude, Type } from 'class-transformer';
import { User } from '../../entities/user/user';
import { ExerciseDto } from '../exercise-dto/exercise-dto';
import { Exercise } from '../../entities/exercise/exercise';

export class WorkoutPlanDto {
  id: number;

  @Exclude()
  username: string;

  title: string;

  dateAdded: Date;

  @Exclude()
  user: User;

  @Exclude()
  exercises: Exercise[];
}
