import { Exclude, Expose } from 'class-transformer';

export class JournalEntryDto {
  @Exclude()
  username: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  dateAdded: Date;
}
