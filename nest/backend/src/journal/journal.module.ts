import { Module } from '@nestjs/common';
import { JournalController } from './journal/journal.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DecoratorsModule } from '../decorators/decorators.module';

@Module({
  imports: [GuardsModule, AuthenticationModule, DecoratorsModule],
  controllers: [JournalController],
})
export class JournalModule {}
