import { Exclude } from 'class-transformer';

export class GetUsersDto {
  username: string;

  @Exclude()
  password: string;

  isAdmin: boolean;

  isActive: boolean;

  @Exclude()
  bmiEntries: [];

  @Exclude()
  journalEntries: [];

  @Exclude()
  workoutPlans: [];

  @Exclude()
  userFoods: [];
}
