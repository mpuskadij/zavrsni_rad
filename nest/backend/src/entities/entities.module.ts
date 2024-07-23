import { Module } from '@nestjs/common';
import { User } from './user/user';
import { Bmientry } from './bmientry/bmientry';

@Module({ exports: [User, Bmientry], providers: [User, Bmientry] })
export class EntitiesModule {}
