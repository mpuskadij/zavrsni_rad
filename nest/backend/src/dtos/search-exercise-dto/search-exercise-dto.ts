import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SearchExerciseDto {
  @IsOptional()
  @IsString({ message: 'Category must be a string!' })
  @MinLength(1, { message: 'Category cannot be empty!' })
  category: string;

  @IsOptional()
  @IsString({ message: 'Equipment must be a string!' })
  @MinLength(1, { message: 'Equipment cannot be empty!' })
  equipment: string;

  @IsOptional()
  @IsString({ message: 'Search term must be a string!' })
  @MinLength(1, { message: 'Search term cannot be empty!' })
  searchTerm: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'Page must be a number!' },
  )
  @Min(1, { message: 'Page cannot be less than 1' })
  @Type(() => Number)
  page: number;
}
