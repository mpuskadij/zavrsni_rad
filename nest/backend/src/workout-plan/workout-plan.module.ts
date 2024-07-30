import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise/exercise.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [GuardsModule, AuthenticationModule],
  controllers: [ExerciseController],
})
export class WorkoutPlanModule {}
