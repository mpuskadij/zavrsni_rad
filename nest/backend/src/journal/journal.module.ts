import { Module } from '@nestjs/common';
import { JournalController } from './journal/journal.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DecoratorsModule } from '../decorators/decorators.module';
import { JournalService } from './journal-service/journal-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from '../entities/journal-entry/journal-entry';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    GuardsModule,
    AuthenticationModule,
    DecoratorsModule,
    UsersModule,
    TypeOrmModule.forFeature([JournalEntry]),
  ],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
