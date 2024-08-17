import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Bmientry } from '../bmientry/bmientry';
import { JournalEntry } from '../journal-entry/journal-entry';
import { WorkoutPlan } from '../workout-plan/workout-plan';
import { UserFood } from '../user_food/user_food';

@Entity()
export class User {
  @PrimaryColumn({ length: 25 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false, nullable: false })
  isAdmin: boolean;

  @Column({ default: true, nullable: false })
  isActive: boolean;

  @OneToMany(() => Bmientry, (bmiEntry) => bmiEntry.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  bmiEntries: Bmientry[];

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  journalEntries: JournalEntry[];

  @OneToMany(() => WorkoutPlan, (workoutPlan) => workoutPlan.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  workoutPlans: WorkoutPlan[];

  @OneToMany(() => UserFood, (userFood) => userFood.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  userFoods: UserFood[];
}
