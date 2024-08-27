import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IExercise } from 'src/interfaces/iexercise';
import { ISearchExercise } from 'src/interfaces/isearch-exercise';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private endPoint = `${environment.apiUrl}exercise?`;
  constructor(private httpClient: HttpClient) {}

  search(query: ISearchExercise) {
    if (!query.searchTerm && !query.category && !query.equipment) {
      throw new Error('Please provide search term, category or equipment!');
    }
    let params = new HttpParams();
    params = params.set('page', query.page);
    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.category) {
      params = params.set('category', query.category);
    }
    if (query.equipment) {
      params = params = params.set('equipment', query.equipment);
    }
    return this.httpClient.get<IExercise[]>(this.endPoint, {
      observe: 'body',
      withCredentials: true,
      responseType: 'json',
      params: params,
    });
  }
}
