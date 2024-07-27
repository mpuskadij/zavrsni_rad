import { Exclude, Expose } from 'class-transformer';

export class JournalEntryDto {
  @Exclude()
  username: string;

  @Expose()
  title: number;

  @Expose()
  description: number;

  @Expose()
  dateAdded: Date;
}
