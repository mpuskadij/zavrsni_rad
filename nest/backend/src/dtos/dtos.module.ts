import { Module } from '@nestjs/common';
import { BmiEntryDto } from './bmi-entry-dto/bmi-entry-dto';

@Module({ exports: [BmiEntryDto], providers: [BmiEntryDto] })
export class DtosModule {}
