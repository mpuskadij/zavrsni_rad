import { Component, Input, OnInit } from '@angular/core';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { IWorkoutPlanDetails } from 'src/interfaces/iworkout-plan-details';
import { map } from 'rxjs';
import { IDeleteExercise } from 'src/interfaces/idelete-exercise';
import { HttpStatusCode } from '@angular/common/http';
import { IDeleteWorkoutPlan } from 'src/interfaces/idelete-workout-plan';
import { Router } from '@angular/router';
import { IExercise } from 'src/interfaces/iexercise';
import { IWorkoutPlanExercise } from 'src/interfaces/iworkout-plan-exercise';

@Component({
  selector: 'app-workout-plan-details',
  templateUrl: './workout-plan-details.component.html',
  styleUrl: './workout-plan-details.component.scss',
})
export class WorkoutPlanDetailsComponent implements OnInit {
  navigateToSearch() {
    if (this.workoutPlanDetails) {
      this.router.navigate([
        `/workout-plans/${this.workoutPlanDetails.id}/add`,
      ]);
    } else {
      this.note = 'Invalid workout plan id!';
    }
  }
  deleteWorkout(workoutPlanId: number) {
    const body: IDeleteWorkoutPlan = { id: workoutPlanId };
    this.workoutPlanService.deleteWorkoutPlan(body).subscribe({
      next: (response) => {
        if (response.status == HttpStatusCode.NoContent) {
          this.note = '';
          this.router.navigate(['/workout-plans'], { replaceUrl: true });
        }
      },
      error: () => {
        this.note =
          'Something went wrong while trying to delete your workout plan!';
      },
    });
  }
  @Input({ required: true }) id: string = '';
  public note: string = '';
  workoutPlanDetails?: IWorkoutPlanDetails;
  constructor(
    private workoutPlanService: WorkoutPlanService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (!+this.id) {
      this.note = 'Invalid parameter!';
    }
    this.workoutPlanService
      .getDetails(+this.id)
      .pipe(
        map((details) => {
          details.dateAdded = new Date(details.dateAdded);
          return details;
        })
      )
      .subscribe({
        next: (details) => {
          this.note = '';
          this.workoutPlanDetails = details;
          if (!this.workoutPlanDetails.exercises.length) {
            this.note = 'No exercises yet!';
          }
        },
        error: () => {
          this.note =
            'Something went wrong while getting workout plan details!';
        },
      });
  }

  deleteExercise(exercise: IWorkoutPlanExercise, index: number) {
    const body: IDeleteExercise = { name: exercise.name };
    if (this.workoutPlanDetails) {
      this.workoutPlanService
        .deleteExercise(this.workoutPlanDetails.id, body)
        .subscribe({
          next: (response) => {
            this.note = 'Successfully deleted exercise!';
            if (response.status == HttpStatusCode.NoContent) {
              this.workoutPlanDetails?.exercises.splice(index, 1);
            }
          },
          error: () => {
            this.note = 'Something went wrong while trying to delete exercise!';
          },
        });
    } else {
      this.note = 'Something went wrong while trying to delete exercise!';
    }
  }
}
