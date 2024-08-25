import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from './guards/guards.module';
import { EntitiesModule } from './entities/entities.module';
import { User } from './entities/user/user';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule } from '@nestjs/config';
import { CrpytoModule } from './crpyto/crpyto.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication/authentication-service/authentication-service';
import { AuthenticationModule } from './authentication/authentication.module';
import { BmiModule } from './bmi/bmi.module';
import { Bmientry } from './entities/bmientry/bmientry';
import { DecoratorsModule } from './decorators/decorators.module';
import { DtosModule } from './dtos/dtos.module';
import { JournalEntry } from './entities/journal-entry/journal-entry';
import { JournalModule } from './journal/journal.module';
import { WorkoutPlanModule } from './workout-plan/workout-plan.module';
import { WorkoutPlan } from './entities/workout-plan/workout-plan';
import { Exercise } from './entities/exercise/exercise';
import { NutritionModule } from './nutrition/nutrition.module';
import { Food } from './entities/food/food';
import { UserFood } from './entities/user_food/user_food';
import { AdminModule } from './admin/admin.module';
import * as Joi from 'joi';
import { ThrottlerModule, seconds, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    GuardsModule,
    ThrottlerModule.forRoot([
      { ttl: seconds(60), limit: 30 },
      { name: 'nutritionix', ttl: seconds(60), limit: 10 },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GOOGLE_RECAPTCHA_SECRET_KEY: Joi.string().min(1).required(),
        JWT_SECRET: Joi.string().min(1).required(),
        NUTRITIONIX_APP_ID: Joi.string().min(1).required(),
        NUTRITIONIX_APP_KEY: Joi.string().min(1).required(),
        TIME_OFFSET: Joi.number().integer().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/database.sqlite',
      synchronize: true,
      autoLoadEntities: true,
      entities: [
        User,
        Bmientry,
        JournalEntry,
        WorkoutPlan,
        Exercise,
        Food,
        UserFood,
      ],
    }),
    EntitiesModule,
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
      response: (req) => req.headers.recaptcha,
      score: 0.5,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: { expiresIn: '15min' },
    }),
    CrpytoModule,
    AuthenticationModule,
    BmiModule,
    DecoratorsModule,
    DtosModule,
    JournalModule,
    WorkoutPlanModule,
    NutritionModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
