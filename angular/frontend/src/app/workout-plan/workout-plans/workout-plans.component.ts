import { Component, OnInit } from '@angular/core';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { IWorkoutPlan } from 'src/interfaces/iworkout-plan';

@Component({
  selector: 'app-workout-plans',
  templateUrl: './workout-plans.component.html',
  styleUrl: './workout-plans.component.scss',
})
export class WorkoutPlansComponent implements OnInit {
  public errorMessage: string = '';
  workoutPlans: IWorkoutPlan[] = [];

  constructor(private workoutPlanService: WorkoutPlanService) {}

  ngOnInit(): void {
    this.workoutPlanService.getAllWorkoutPlans().subscribe({
      next: (workoutPlansFromServer) => {
        this.workoutPlans = workoutPlansFromServer;
      },
      error: () => {
        this.errorMessage =
          'Something went wrong with getting your workout plans!';
      },
    });
  }
}
