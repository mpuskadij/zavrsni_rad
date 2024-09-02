import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAddFoodToNutrition } from 'src/interfaces/iadd-food-to-nutrition';
import { INutritionFood } from 'src/interfaces/inutrition-food';
import { IUpdateFoodsBody } from 'src/interfaces/iupdate-foods-body';

@Injectable({
  providedIn: 'root',
})
export class NutritionService {
  private endpoint = `${environment.apiUrl}nutrition/`;
  constructor(private httpClient: HttpClient) {}

  getNutrition() {
    return this.httpClient.get<INutritionFood[]>(this.endpoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  deleteFood(foodID: number) {
    if (isNaN(foodID)) {
      throw new Error('Invalid food ID!');
    }
    return this.httpClient.delete<HttpResponse<object>>(
      `${this.endpoint}${foodID}`,
      {
        observe: 'response',
      }
    );
  }

  addToNutrition(body: IAddFoodToNutrition) {
    if (body.id !== undefined && body.id.length == 0) {
      throw new Error('ID is empty!');
    } else if (body.name !== undefined && body.name.length == 0) {
      throw new Error('Name is empty!');
    }
    return this.httpClient.post<HttpResponse<object>>(
      `${this.endpoint}`,
      body,
      {
        observe: 'response',
      }
    );
  }

  updateQuantity(body: IUpdateFoodsBody) {
    if (!body.foods.length) {
      throw new Error('No foods to update!');
    } else if (body.foods.some((food) => food.quantity <= 0)) {
      throw new Error('Quantity of 0 or less is not allowed!');
    }
    if (body.foods.some((food) => isNaN(food.id))) {
      throw new Error('One or more foods have invalid ID!');
    }
    return this.httpClient.put<HttpResponse<object>>(`${this.endpoint}`, body, {
      observe: 'response',
    });
  }
}
