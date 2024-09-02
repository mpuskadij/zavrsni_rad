import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFoodDetails } from 'src/interfaces/ifood-details';
import { IFoodSearchQuery } from 'src/interfaces/ifood-search-query';
import { IFoodSearchResponseBody } from 'src/interfaces/ifood-search-response-body';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private endPoint = `${environment.apiUrl}food`;

  constructor(private httpClient: HttpClient) {}

  searchFood(query: IFoodSearchQuery) {
    if (!query.searchTerm.length) {
      throw new Error('Search term cannot be empty!');
    }
    const parameters = new HttpParams().set('searchTerm', query.searchTerm);

    return this.httpClient.get<IFoodSearchResponseBody>(`${this.endPoint}`, {
      observe: 'body',
      responseType: 'json',
      params: parameters,
    });
  }

  getDetails(parameterName: string, parameterValue: string) {
    if (
      (parameterName === 'name' || parameterName === 'id') &&
      parameterValue.length
    ) {
      const parameters = new HttpParams().set(parameterName, parameterValue);
      return this.httpClient.get<IFoodDetails>(`${this.endPoint}/details`, {
        observe: 'body',
        params: parameters,
        responseType: 'json',
      });
    } else {
      throw new Error('Invalid query parameters!');
    }
  }
}
