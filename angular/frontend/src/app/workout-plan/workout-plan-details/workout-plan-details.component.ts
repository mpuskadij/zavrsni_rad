import { Component, Input, NgZone, OnInit } from '@angular/core';
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
  @Input({ required: true }) id: string = '';
  public note: string = '';
  workoutPlanDetails?: IWorkoutPlanDetails;
  constructor(
    private ngZone: NgZone,
    private workoutPlanService: WorkoutPlanService,
    private router: Router
  ) {}
  ngOnInit(): void {
    try {
      if (!+this.id) {
        throw new Error('ID is not a number!');
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
    } catch (error: any) {
      this.note = error.message;
    }
  }

  deleteExercise(exercise: IWorkoutPlanExercise, index: number) {
    try {
      if (isNaN(index)) throw new Error('Invalid table index!');
      if (!exercise.name.length) throw new Error('Exercise name is empty!');
      const body: IDeleteExercise = { name: exercise.name };
      if (this.workoutPlanDetails) {
        this.workoutPlanService
          .deleteExercise(this.workoutPlanDetails.id, body)
          .subscribe({
            next: () => {
              this.note = 'Successfully deleted exercise!';
              this.workoutPlanDetails!.exercises.splice(index, 1);
            },
            error: () => {
              this.note =
                'Something went wrong while trying to delete exercise!';
            },
          });
      } else {
        throw new Error(
          'Something went wrong while trying to delete exercise!'
        );
      }
    } catch (error: any) {
      this.note = error.message;
    }
  }

  navigateToSearch() {
    if (this.workoutPlanDetails) {
      this.ngZone.run(() => {
        this.router.navigate([
          `/workout-plans/${this.workoutPlanDetails!.id}/add`,
        ]);
      });
    } else {
      this.note = 'Invalid workout plan id!';
    }
  }
  deleteWorkout(workoutPlanId: number) {
    try {
      if (isNaN(workoutPlanId))
        throw new Error('Invalid ID of the workout plan to delete!');
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
    } catch (error: any) {
      this.note = error.message;
    }
  }
}
