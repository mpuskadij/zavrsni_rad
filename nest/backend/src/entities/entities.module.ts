import { Module } from '@nestjs/common';
import { User } from './user/user';
import { Bmientry } from './bmientry/bmientry';
import { JournalEntry } from './journal-entry/journal-entry';
import { WorkoutPlan } from './workout-plan/workout-plan';
import { Exercise } from './exercise/exercise';

@Module({
  exports: [User, Bmientry, JournalEntry, WorkoutPlan, Exercise],
  providers: [User, Bmientry, JournalEntry, WorkoutPlan, Exercise],
})
export class EntitiesModule {}
