import { Exclude, Expose } from 'class-transformer';
import { Bmientry } from '../../entities/bmientry/bmientry';

export class BmiEntryDto {
  @Exclude()
  username: string;

  @Expose()
  bmi: number;

  @Expose()
  dateAdded: Date;
}
