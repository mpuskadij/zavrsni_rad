import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { BmiComponent } from './bmi/bmi/bmi.component';
import { WorkoutPlansComponent } from './workout-plan/workout-plans/workout-plans.component';
import { loginGuard } from './login-guard/login.guard';
import { CreateWorkoutPlanComponent } from './workout-plan/create-workout-plan/create-workout-plan.component';
import { WorkoutPlanDetailsComponent } from './workout-plan/workout-plan-details/workout-plan-details.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'bmi',
    component: BmiComponent,
    canActivate: [loginGuard],
    title: 'BMI',
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'workout-plans',
    component: WorkoutPlansComponent,
    canActivate: [loginGuard],
    title: 'Workout plans',
  },
  {
    path: 'workout-plans/create',
    title: 'Create a workout plan',
    component: CreateWorkoutPlanComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'workout-plans/:id',
    title: 'Workout plan details',
    canActivate: [loginGuard],
    component: WorkoutPlanDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
