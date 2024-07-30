import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise/exercise.controller';

@Module({
  controllers: [ExerciseController]
})
export class WorkoutPlanModule {}
