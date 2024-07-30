import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise/exercise.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { DtosModule } from '../dtos/dtos.module';

@Module({
  imports: [GuardsModule, AuthenticationModule, DtosModule],
  controllers: [ExerciseController],
})
export class WorkoutPlanModule {}
