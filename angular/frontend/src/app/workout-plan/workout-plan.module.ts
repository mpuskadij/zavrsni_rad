import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPlansComponent } from './workout-plans/workout-plans.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [WorkoutPlansComponent],
  imports: [CommonModule],
  providers: [provideHttpClient(withFetch())],
})
export class WorkoutPlanModule {}
