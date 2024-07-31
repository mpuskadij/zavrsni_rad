import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkoutPlanDto {
  @IsString({ message: 'Title must be a string!' })
  @MinLength(1, { message: 'Tittle cannot be empty!' })
  @MaxLength(50, { message: 'Title cannot be longer than 50 characters!' })
  title: string;
}
