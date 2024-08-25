import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPlansComponent } from './workout-plans/workout-plans.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { WorkoutPlanService } from './workout-plan-service/workout-plan.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';

@NgModule({
  declarations: [WorkoutPlansComponent],
  imports: [CommonModule, NavigationComponent, TimeModule],
  providers: [provideHttpClient(withFetch()), WorkoutPlanService],
})
export class WorkoutPlanModule {}
