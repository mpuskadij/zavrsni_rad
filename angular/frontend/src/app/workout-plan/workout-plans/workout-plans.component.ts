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
          this.errorMessage =
            'Something went wrong with getting your workout plans!';
        },
      });
  }

  getDetailsOfWorkoutPlan(id: number) {
    this.ngZone.run(() => {
      this.router.navigate(['/workout-plans/' + id]);
    });
  }

  deleteWorkout(workoutPlanId: number) {
    const body: IDeleteWorkoutPlan = { id: workoutPlanId };
    this.workoutPlanService.deleteWorkoutPlan(body).subscribe({
      next: (response) => {
        if (response.status == HttpStatusCode.NoContent) {
          const index = this.workoutPlans.findIndex(
            (wp) => wp.id == workoutPlanId
          );
          if (index != -1) {
            this.workoutPlans.splice(index);
          } else {
            this.errorMessage = 'Could not find workout plan in the table!';
          }
        }
      },
      error: () => {
        this.errorMessage =
          'Something went wrong while trying to delete your workout plan!';
      },
    });
  }

  navigateToForm() {
    this.ngZone.run(() => {
      this.router.navigate(['/workout-plans/create']);
    });
  }
}
