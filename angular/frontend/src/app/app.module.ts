import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { UserModule } from './user/user.module';
import { NavigationComponent } from './navigation/navigation.component';
import { BmiModule } from './bmi/bmi.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './user/login/login.component';
import { UserService } from './user/user-service/user.service';
import { BmiService } from './bmi/bmi-service/bmi.service';
import { WorkoutPlanModule } from './workout-plan/workout-plan.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { WorkoutPlanService } from './workout-plan/workout-plan-service/workout-plan.service';
import { FoodService } from './nutrition/food-service/food.service';
import { NutritionService } from './nutrition/nutrition-service/nutrition.service';
import { unauthorizedInterceptor } from './unauthorized-interceptor/unauthorized.interceptor';
import { contentTypeInterceptor } from './content-type-interceptor/content-type.interceptor';
import { JournalModule } from './journal/journal.module';
import { UsersComponent } from './admin/users/users.component';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin-service/admin.service';
import { TimeService } from './time/time-service/time.service';
import { ExerciseService } from './workout-plan/exercise-service/exercise.service';
import { JournalService } from './journal/journal-service/journal.service';
import { TimeModule } from './time/time.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    NavigationComponent,
    BmiModule,
    RecaptchaV3Module,
    WorkoutPlanModule,
    NutritionModule,
    JournalModule,
    AdminModule,
    TimeModule,
  ],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([contentTypeInterceptor, unauthorizedInterceptor])
    ),
    provideCharts(withDefaultRegisterables()),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.site_key },
    UserService,
    BmiService,
    WorkoutPlanService,
    FoodService,
    NutritionService,
    AdminService,
    TimeService,
    ExerciseService,
    JournalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
