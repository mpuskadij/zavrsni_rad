import { Component, NgZone, OnInit } from '@angular/core';
import { INutritionFood } from 'src/interfaces/inutrition-food';
import { NutritionService } from '../nutrition-service/nutrition.service';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { IUpdateFoodsBody } from 'src/interfaces/iupdate-foods-body';
import { IUpdateFoodDetails } from 'src/interfaces/iupdate-food-details';

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
    private router: Router,
    private ngZone: NgZone
  ) {}

  changeQuantity(food: INutritionFood) {
    if (food.quantity <= 0) {
      this.note = 'Quantity cannot be 0 or less!';
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
        if (!foodFromServer.length) {
          this.note = "You don't have any food in nutrition!";
          return;
        }
        this.foods = foodFromServer;
        this.calculateSum();
      },
      error: () => {
        this.note = "You don't have any food in nutrition!";
      },
    });
  }

  deleteFood(foodID: number, index: number) {
    try {
      if (isNaN(foodID) || isNaN(index))
        throw new Error('Invalid table index or ID');
      this.nutritionService.deleteFood(foodID).subscribe({
        next: () => {
          this.note = 'Successfully deleted food!';
          this.foods.splice(index, 1);
          this.calculateSum();
        },
        error: () => {
          this.note =
            'Something went wrong while trying to delete food from nutrition!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }
  private calculateSum() {
    this.sumOfCalories = 0;
    this.foods.forEach((food) => {
      if (food.calories) {
        this.sumOfCalories += food.calories * food.quantity;
      }
    });
  }

  updateQuantity() {
    try {
      if (!this.changedFoods.length) {
        throw new Error('No foods to update!');
      }
      const foods: IUpdateFoodDetails[] = this.changedFoods.map(
        (changedFood) => {
          return { id: changedFood.id, quantity: changedFood.quantity };
        }
      );
      const body: IUpdateFoodsBody = { foods: foods };
      this.nutritionService.updateQuantity(body).subscribe({
        next: () => {
          this.calculateSum();
          this.changedFoods = [];
        },
        error: () => {
          this.note =
            'Something went wrong while trying to update food quantity!';
        },
      });
    } catch (error: any) {
      this.note = error.message;
    }
  }
  navigateToFoodSearch() {
    this.ngZone.run(() => {
      this.router.navigate(['/nutrition/add']);
    });
  }
}
