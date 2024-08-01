import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Bmientry } from '../bmientry/bmientry';
import { JournalEntry } from '../journal-entry/journal-entry';
import { WorkoutPlan } from '../workout-plan/workout-plan';

@Entity()
export class User {
  @PrimaryColumn({ length: 25 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 0, nullable: true })
  isAdmin: number;

  @OneToMany(() => Bmientry, (bmiEntry) => bmiEntry.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  bmiEntries: Bmientry[];

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  journalEntries: JournalEntry[];

  @OneToMany(() => WorkoutPlan, (workoutPlan) => workoutPlan.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  workoutPlans: WorkoutPlan[];
}
