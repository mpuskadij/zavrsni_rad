import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAddFoodToNutrition } from 'src/interfaces/iadd-food-to-nutrition';
import { INutritionFood } from 'src/interfaces/inutrition-food';

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
    return this.httpClient.delete<HttpResponse<object>>(
      `${this.endpoint}${foodID}`,
      {
        observe: 'response',
      }
    );
  }

  addToNutrition(body: IAddFoodToNutrition) {
    return this.httpClient.post<HttpResponse<object>>(
      `${this.endpoint}`,
      body,
      {
        observe: 'response',
      }
    );
  }

  updateQuantity(body: INutritionFood[]) {
    return this.httpClient.put<HttpResponse<object>>(`${this.endpoint}`, body, {
      observe: 'response',
    });
  }
}
