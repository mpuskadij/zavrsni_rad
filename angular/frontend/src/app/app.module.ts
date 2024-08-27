import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
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
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideCharts(withDefaultRegisterables()),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.site_key },
    UserService,
    BmiService,
    WorkoutPlanService,
    FoodService,
    NutritionService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
