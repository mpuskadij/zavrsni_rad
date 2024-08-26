import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPlansComponent } from './workout-plans/workout-plans.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { WorkoutPlanService } from './workout-plan-service/workout-plan.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateWorkoutPlanComponent } from './create-workout-plan/create-workout-plan.component';
import { RouterOutlet } from '@angular/router';
import { WorkoutPlanDetailsComponent } from './workout-plan-details/workout-plan-details.component';

@NgModule({
  declarations: [
    WorkoutPlansComponent,
    CreateWorkoutPlanComponent,
    WorkoutPlanDetailsComponent,
  ],
  imports: [
    CommonModule,
    NavigationComponent,
    TimeModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    WorkoutPlansComponent,
    CreateWorkoutPlanComponent,
    WorkoutPlanDetailsComponent,
  ],
  providers: [provideHttpClient(withFetch()), WorkoutPlanService],
})
export class WorkoutPlanModule {}
