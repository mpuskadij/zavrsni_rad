import { Type } from 'class-transformer';

export class TimeDto {
  @Type(() => Date)
  time: Date;
}
