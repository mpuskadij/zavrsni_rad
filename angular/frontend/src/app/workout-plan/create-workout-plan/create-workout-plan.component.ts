import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan.service';
import { ICreateWorkoutPlan } from 'src/interfaces/icreate-workout-plan';

@Component({
  selector: 'app-create-workout-plan',
  templateUrl: './create-workout-plan.component.html',
  styleUrl: './create-workout-plan.component.scss',
})
export class CreateWorkoutPlanComponent {
  form = this.formBuilder.group({
    title: ['', [Validators.required]],
  });
  errorMessage: string = '';

  constructor(
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private router: Router,
    private workoutPlanService: WorkoutPlanService
  ) {}

  cancel() {
    this.ngZone.run(() => {
      this.router.navigate(['/workout-plans'], {
        replaceUrl: true,
      });
    });
  }

  submit() {
    try {
      if (this.form.valid) {
        this.errorMessage = '';
        const workoutPlanData: ICreateWorkoutPlan = {
          title: this.form.controls.title.value!,
        };
        this.workoutPlanService.createWorkoutPlan(workoutPlanData).subscribe({
          next: () => {
            this.cancel();
          },
          error: () => {
            this.errorMessage =
              'Something went wrong while trying to create your workout plan!';
          },
        });
      } else {
        throw new Error('Title was not provided!');
      }
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
