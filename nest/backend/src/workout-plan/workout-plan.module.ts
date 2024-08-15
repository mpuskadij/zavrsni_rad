import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise/exercise.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DtosModule } from '../dtos/dtos.module';
import { WgerService } from './wger-service/wger-service';
import { WorkoutPlanController } from './workout-plan/workout-plan.controller';
import { DecoratorsModule } from '../decorators/decorators.module';
import { WorkoutPlanService } from './workout-plan-service/workout-plan-service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users-service/users-service';
import { CrpytoModule } from '../crpyto/crpyto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutPlan } from '../entities/workout-plan/workout-plan';
import { ExerciseService } from './exercise-service/exercise-service';
import { Exercise } from './../entities/exercise/exercise';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    AdminModule,
    GuardsModule,
    AuthenticationModule,
    DtosModule,
    DecoratorsModule,
    UsersModule,
    CrpytoModule,
    TypeOrmModule.forFeature([WorkoutPlan, Exercise]),
  ],
  controllers: [ExerciseController, WorkoutPlanController],
  providers: [WgerService, WorkoutPlanService, UsersService, ExerciseService],
})
export class WorkoutPlanModule {}
