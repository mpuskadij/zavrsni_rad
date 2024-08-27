import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { INutritionFood } from 'src/interfaces/inutrition-food';

@Injectable({
  providedIn: 'root',
})
export class NutritionService {
  private endpoint = `${environment.apiUrl}nutrition/`;
  constructor(private httpClient: HttpClient) {}

  getNutrition() {
    return this.httpClient.get<INutritionFood[]>(this.endpoint, {
      withCredentials: true,
      observe: 'body',
      responseType: 'json',
    });
  }

  deleteFood(foodID: number) {
    return this.httpClient.delete<HttpResponse<object>>(
      `${this.endpoint}${foodID}`,
      {
        withCredentials: true,
        observe: 'response',
      }
    );
  }
}
