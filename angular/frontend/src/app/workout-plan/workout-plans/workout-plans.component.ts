import { Component, NgZone, OnInit } from '@angular/core';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { IWorkoutPlan } from 'src/interfaces/iworkout-plan';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpStatusCode } from '@angular/common/http';
import { IDeleteWorkoutPlan } from 'src/interfaces/idelete-workout-plan';

@Component({
  selector: 'app-workout-plans',
  templateUrl: './workout-plans.component.html',
  styleUrl: './workout-plans.component.scss',
})
export class WorkoutPlansComponent implements OnInit {
  public errorMessage: string = '';
  workoutPlans: IWorkoutPlan[] = [];

  constructor(
    private workoutPlanService: WorkoutPlanService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.workoutPlanService
      .getAllWorkoutPlans()
      .pipe(
        map((workoutPlans) => {
          workoutPlans.forEach((workoutPlan) => {
            workoutPlan.dateAdded = new Date(workoutPlan.dateAdded);
          });
          return workoutPlans;
        })
      )
      .subscribe({
        next: (workoutPlansFromServer) => {
          this.workoutPlans = workoutPlansFromServer;
        },
        error: () => {
          this.errorMessage = 'No workout plans yet!';
        },
      });
  }

  getDetailsOfWorkoutPlan(id: number) {
    try {
      if (isNaN(id)) {
        throw new Error('ID is invalid!');
      }
      this.ngZone.run(() => {
        this.router.navigate(['/workout-plans/' + id]);
      });
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
  navigateToForm() {
    this.ngZone.run(() => {
      this.router.navigate(['/workout-plans/create']);
    });
  }
}
