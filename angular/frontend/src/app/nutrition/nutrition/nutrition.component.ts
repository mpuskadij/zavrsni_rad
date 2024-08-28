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
  public sumOfCalories = 0;
  public quantityChanged: boolean = false;
  public note = '';
  public changedFoods: INutritionFood[] = [];
  public foods: INutritionFood[] = [];

  constructor(
    private nutritionService: NutritionService,
    private router: Router
  ) {}

  changeQuantity(food: INutritionFood) {
    if (food.quantity < 0) {
      this.note = 'Quantity cannot be less than 1!';
      return;
    }
    const foundFood = this.changedFoods.find((changedFood) => {
      return changedFood.id == food.id;
    });
    if (!foundFood) {
      this.changedFoods.push(food);
    } else {
      foundFood.quantity = food.quantity;
    }
    this.calculateSum();
  }

  ngOnInit(): void {
    this.nutritionService.getNutrition().subscribe({
      next: (foodFromServer) => {
        this.foods = foodFromServer;
        this.calculateSum();
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
          this.calculateSum();
        }
      },
      error: () => {
        this.note =
          'Something went wrong while trying to delete food from nutrition!';
      },
    });
  }
  private calculateSum() {
    this.sumOfCalories = 0;
    this.foods.forEach((food) => {
      if (food.calories) {
        this.sumOfCalories += food.calories;
      }
    });
  }

  updateQuantity() {
    this.nutritionService.updateQuantity(this.changedFoods).subscribe({
      next: () => {
        this.calculateSum();
      },
      error: () => {
        this.note =
          'Something went wrong while trying to update food quantity!';
      },
    });
  }
  navigateToFoodSearch() {
    this.router.navigate(['/nutrition/add']);
  }
}
