import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IWorkoutPlan } from 'src/interfaces/iworkout-plan';

@Injectable({
  providedIn: 'root',
})
export class WorkoutPlanService {
  private endpoint: string = `${environment.url}workout-plans`;
  getAllWorkoutPlans(): Observable<IWorkoutPlan[]> {
    return this.httpClient.get<IWorkoutPlan[]>(this.endpoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  constructor(private httpClient: HttpClient) {}
}
