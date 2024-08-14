import { Exclude } from 'class-transformer';

export class GetUsersDto {
  username: string;

  @Exclude()
  password: string;

  isAdmin: number;

  @Exclude()
  bmiEntries: [];

  @Exclude()
  journalEntries: [];

  @Exclude()
  workoutPlans: [];

  @Exclude()
  userFoods: [];
}
