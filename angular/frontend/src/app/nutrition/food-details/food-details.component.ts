import { Component, Input, OnInit } from '@angular/core';
import { FoodService } from '../food-service/food.service';
import { IFoodDetails } from 'src/interfaces/ifood-details';
import { NutritionService } from '../nutrition-service/nutrition.service';
import { IAddFoodToNutrition } from 'src/interfaces/iadd-food-to-nutrition';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private nutritionService: NutritionService,
    private router: Router
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

  addFood() {
    let body: IAddFoodToNutrition;
    if (this.type == 'branded') {
      body = { id: this.id };
    } else if (this.type == 'common') {
      body = { name: this.id };
    } else {
      this.note = 'Invalid food type';
      return;
    }
    this.nutritionService.addToNutrition(body).subscribe({
      next: () => {
        this.router.navigate(['/nutrition']);
      },
      error: () => {
        this.note =
          'Something went wrong while trying to add food to nutrition!';
      },
    });
  }
}
