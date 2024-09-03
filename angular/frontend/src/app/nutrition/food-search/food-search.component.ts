import { Component, NgZone } from '@angular/core';
import { IFoodSearchQuery } from 'src/interfaces/ifood-search-query';
import { FoodService } from '../food-service/food.service';
import { IFoodSearchResponseBody } from 'src/interfaces/ifood-search-response-body';
import { ICommonFood } from 'src/interfaces/icommon-food';
import { IBrandedFood } from 'src/interfaces/ibranded-food';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food-search',
  templateUrl: './food-search.component.html',
  styleUrl: './food-search.component.scss',
})
export class FoodSearchComponent {
  foods?: IFoodSearchResponseBody;
  note = '';

  constructor(
    private foodService: FoodService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  search(searchTerm: string) {
    try {
      if (!searchTerm) {
        throw new Error('Search term is empty!');
      }
      const query: IFoodSearchQuery = { searchTerm: searchTerm };
      this.foodService.searchFood(query).subscribe({
        next: (foodFromServer) => {
          this.foods = foodFromServer;
        },
        error: () => {
          this.note = 'No food found matching the search term!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }

  navigateToDetailsOfCommonFood(commonFood: ICommonFood) {
    return this.navigateToDetails('common', commonFood.food_name);
  }

  navigateToDetailsOfBrandedFood(brandedFood: IBrandedFood) {
    return this.navigateToDetails('branded', brandedFood.nix_item_id);
  }

  private navigateToDetails(type: string, value: string) {
    if (!type || !value) {
      this.note =
        'Something went wrong while trying to navigate to food details!';
      return;
    }
    this.ngZone.run(() => {
      this.router.navigate([`/nutrition/add/${type}/${value}`]);
    });
  }
}
