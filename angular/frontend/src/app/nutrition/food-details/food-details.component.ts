import { Component, Input, OnInit } from '@angular/core';
import { FoodService } from '../food-service/food.service';
import { IFoodDetails } from 'src/interfaces/ifood-details';
import { NutritionService } from '../nutrition-service/nutrition.service';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.scss',
})
export class FoodDetailsComponent implements OnInit {
  @Input({ required: true }) type = '';
  @Input({ required: true }) id = '';
  note = '';
  invalidType = false;
  details?: IFoodDetails;

  constructor(
    private foodService: FoodService,
    private nutritionService: NutritionService
  ) {}

  ngOnInit(): void {
    if ((this.id && this.type === 'common') || this.type === 'branded') {
      const queryParameter = this.type === 'common' ? 'name' : 'id';
      this.foodService.getDetails(queryParameter, this.id).subscribe({
        next: (detailsFromServer) => {
          this.details = detailsFromServer;
        },
        error: () => {
          this.note = 'Something went wrong while trying to get details!';
        },
      });
    } else {
      this.invalidType = true;
    }
  }

  addFood() {}
}
