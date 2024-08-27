import { Component, OnInit } from '@angular/core';
import { INutritionFood } from 'src/interfaces/inutrition-food';
import { NutritionService } from '../nutrition-service/nutrition.service';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.scss',
})
export class NutritionComponent implements OnInit {
  navigateToFoodSearch() {
    this.router.navigate(['/nutrition/add']);
  }
  public quantityChanged: boolean = false;
  public note = '';
  public changedFoods: INutritionFood[] = [];
  public foods: INutritionFood[] = [];

  constructor(
    private nutritionService: NutritionService,
    private router: Router
  ) {}

  changeQuantity(food: INutritionFood) {
    if (this.changedFoods.length > 0) {
      const foundFood = this.changedFoods.find((changedFood) => {
        changedFood.id == food.id;
      });
      if (foundFood) {
        foundFood.quantity = food.quantity;
      }
    }
    this.changedFoods.push(food);
  }

  ngOnInit(): void {
    this.nutritionService.getNutrition().subscribe({
      next: (foodFromServer) => {
        this.foods = foodFromServer;
      },
      error: () => {
        this.note = "You don't have any food in nutrition!";
      },
    });
  }

  deleteFood(foodID: number, index: number) {
    this.nutritionService.deleteFood(foodID).subscribe({
      next: (response) => {
        if (response.status == HttpStatusCode.NoContent) {
          this.note = 'Successfully deleted food!';
          this.foods.splice(index, 1);
        }
      },
      error: () => {
        this.note =
          'Something went wrong while trying to delete food from nutrition!';
      },
    });
  }
}
