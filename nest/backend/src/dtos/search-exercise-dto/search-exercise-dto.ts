import { IsString, MinLength } from 'class-validator';

export class SearchExerciseDto {
  @IsString({ message: 'Search term must be a string!' })
  @MinLength(1, { message: 'Search term cannot be empty!' })
  searchTerm: string;
}
