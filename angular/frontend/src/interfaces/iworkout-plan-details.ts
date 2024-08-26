import { IWorkoutPlan } from './iworkout-plan';
import { IWorkoutPlanExercise } from './iworkout-plan-exercise';

export interface IWorkoutPlanDetails extends IWorkoutPlan {
  exercises: IWorkoutPlanExercise[];
}
