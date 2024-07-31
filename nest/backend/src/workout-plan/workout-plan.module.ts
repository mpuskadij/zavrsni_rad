import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise/exercise.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DtosModule } from '../dtos/dtos.module';
import { WgerService } from './wger-service/wger-service';
import { WorkoutPlanController } from './workout-plan/workout-plan.controller';
import { DecoratorsModule } from '../decorators/decorators.module';
import { WorkoutPlanService } from './workout-plan-service/workout-plan-service';

@Module({
  imports: [GuardsModule, AuthenticationModule, DtosModule, DecoratorsModule],
  controllers: [ExerciseController, WorkoutPlanController],
  providers: [WgerService, WorkoutPlanService],
})
export class WorkoutPlanModule {}
