import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Allow,
  IsDate,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class JournalEntryDto {
  @Exclude()
  @IsOptional()
  username?: string;

  @Expose()
  @IsString({ message: 'Title is not a string!' })
  @MinLength(1, { message: 'Title cannot be empty!' })
  @MaxLength(50, {
    message: 'Title length is maximum $constraint1 characters!',
  })
  title: string;

  @Expose()
  @IsString({ message: 'Description is not a string!' })
  @MinLength(1, { message: 'Description cannot be empty!' })
  description: string;

  @Expose()
  @IsInt({ message: 'ID is not a number' })
  @IsPositive({ message: 'ID is not positive' })
  id: number;

  @Expose()
  @IsOptional()
  @Type(() => Date)
  dateAdded?: Date;
}
