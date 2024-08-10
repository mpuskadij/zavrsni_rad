import { Module } from '@nestjs/common';
import { User } from './user/user';
import { Bmientry } from './bmientry/bmientry';
import { JournalEntry } from './journal-entry/journal-entry';
import { WorkoutPlan } from './workout-plan/workout-plan';
import { Exercise } from './exercise/exercise';
import { Food } from './food/food';
import { UserFood } from './user_food/user_food';

@Module({
  exports: [
    User,
    Bmientry,
    JournalEntry,
    WorkoutPlan,
    Exercise,
    Food,
    UserFood,
  ],
  providers: [
    User,
    Bmientry,
    JournalEntry,
    WorkoutPlan,
    Exercise,
    Food,
    UserFood,
  ],
})
export class EntitiesModule {}
