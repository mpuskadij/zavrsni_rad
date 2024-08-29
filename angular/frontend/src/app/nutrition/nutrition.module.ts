import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';
import { NutritionComponent } from './nutrition/nutrition.component';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NutritionService } from './nutrition-service/nutrition.service';
import { FoodSearchComponent } from './food-search/food-search.component';
import { FoodService } from './food-service/food.service';
import { AppRoutingModule } from '../app-routing.module';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { unauthorizedInterceptor } from '../unauthorized-interceptor/unauthorized.interceptor';
import { FormsModule, NgModel } from '@angular/forms';

@NgModule({
  declarations: [NutritionComponent, FoodSearchComponent, FoodDetailsComponent],
  imports: [
    TimeModule,
    CommonModule,
    NavigationComponent,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  exports: [NutritionComponent, FoodSearchComponent, FoodDetailsComponent],
})
export class NutritionModule {}
