import { IsString, MinLength } from 'class-validator';

export class AddExerciseToWorkoutPlanDto {
  @IsString({ message: 'Exercise name is not a string!' })
  @MinLength(1, { message: 'Exercise name cannot be empty!' })
  name: string;
}
