import { IsString, MinLength } from 'class-validator';

export class SearchFoodDto {
  @IsString()
  @MinLength(1, { message: 'Search term cannot be empty!' })
  searchTerm: string;
}
