import { Component } from '@angular/core';
import { IFoodSearchQuery } from 'src/interfaces/ifood-search-query';
import { FoodService } from '../food-service/food.service';
import { IFoodSearchResponseBody } from 'src/interfaces/ifood-search-response-body';

@Component({
  selector: 'app-food-search',
  templateUrl: './food-search.component.html',
  styleUrl: './food-search.component.scss',
})
export class FoodSearchComponent {
  foods?: IFoodSearchResponseBody;
  note = '';
  constructor(private foodService: FoodService) {}
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
}
