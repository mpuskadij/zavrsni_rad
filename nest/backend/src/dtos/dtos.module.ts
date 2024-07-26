import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';
import { EntitiesModule } from '../entities/entities.module';
import { Bmientry } from '../entities/bmientry/bmientry';

@Module({
  imports: [EntitiesModule],
  exports: [BmiEntryDto],
  providers: [BmiEntryDto, Bmientry],
})
export class DtosModule {}
