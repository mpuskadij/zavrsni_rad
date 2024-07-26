import { Module } from '@nestjs/common';
import { User } from './user/user';
import { Bmientry } from './bmientry/bmientry';
import { JournalEntry } from './journal-entry/journal-entry';

@Module({
  exports: [User, Bmientry, JournalEntry],
  providers: [User, Bmientry, JournalEntry],
})
export class EntitiesModule {}
