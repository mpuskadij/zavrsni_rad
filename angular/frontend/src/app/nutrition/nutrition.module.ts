import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { TimeModule } from '../time/time.module';
import { NutritionComponent } from './nutrition/nutrition.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NutritionService } from './nutrition-service/nutrition.service';
import { FoodSearchComponent } from './food-search/food-search.component';
import { FoodService } from './food-service/food.service';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [NutritionComponent, FoodSearchComponent],
  imports: [TimeModule, CommonModule, NavigationComponent, AppRoutingModule],
  providers: [provideHttpClient(withFetch()), NutritionService, FoodService],
  exports: [NutritionComponent, FoodSearchComponent],
})
export class NutritionModule {}
