import { Component, Input, OnInit } from '@angular/core';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { IWorkoutPlanDetails } from 'src/interfaces/iworkout-plan-details';
import { map } from 'rxjs';
import { IDeleteExercise } from 'src/interfaces/idelete-exercise';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-workout-plan-details',
  templateUrl: './workout-plan-details.component.html',
  styleUrl: './workout-plan-details.component.scss',
})
export class WorkoutPlanDetailsComponent implements OnInit {
  @Input({ required: true }) id: string = '';
  public note: string = '';
  workoutPlanDetails?: IWorkoutPlanDetails;
  constructor(private workoutPlanService: WorkoutPlanService) {}
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

  deleteExercise(exerciseName: string) {
    const body: IDeleteExercise = { name: exerciseName };
    if (this.workoutPlanDetails) {
      this.workoutPlanService
        .deleteExercise(this.workoutPlanDetails.id, body)
        .subscribe({
          next: (response) => {
            this.note = 'Successfully deleted exercise!';
            if (response.status == HttpStatusCode.NoContent) {
              const index = this.workoutPlanDetails!.exercises.findIndex(
                (exercise) => exercise.name == exerciseName
              );
              this.workoutPlanDetails!.exercises.splice(index);
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
