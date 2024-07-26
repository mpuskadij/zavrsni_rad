import { Module } from '@nestjs/common';
import { JournalController } from './journal/journal.controller';

@Module({
  controllers: [JournalController]
})
export class JournalModule {}
