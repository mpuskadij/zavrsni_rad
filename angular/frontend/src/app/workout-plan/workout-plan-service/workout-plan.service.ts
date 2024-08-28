import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddExercise } from 'src/interfaces/iadd-exercise';
import { ICreateWorkoutPlan } from 'src/interfaces/icreate-workout-plan';
import { IDeleteExercise } from 'src/interfaces/idelete-exercise';
import { IDeleteWorkoutPlan } from 'src/interfaces/idelete-workout-plan';
import { IWorkoutPlan } from 'src/interfaces/iworkout-plan';
import { IWorkoutPlanDetails } from 'src/interfaces/iworkout-plan-details';

@Injectable({
  providedIn: 'root',
})
export class WorkoutPlanService {
  private endpoint: string = `${environment.apiUrl}workout-plans`;
  getAllWorkoutPlans(): Observable<IWorkoutPlan[]> {
    return this.httpClient.get<IWorkoutPlan[]>(this.endpoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  getDetails(id: number) {
    return this.httpClient.get<IWorkoutPlanDetails>(`${this.endpoint}/${id}`, {
      observe: 'body',
      responseType: 'json',
    });
  }

  deleteWorkoutPlan(deleteWorkoutPlanData: IDeleteWorkoutPlan) {
    return this.httpClient.delete<HttpResponse<object>>(`${this.endpoint}`, {
      body: deleteWorkoutPlanData,
      observe: 'response',
    });
  }
  deleteExercise(workoutPlanId: number, deleteExercise: IDeleteExercise) {
    return this.httpClient.delete<HttpResponse<object>>(
      `${this.endpoint}/${workoutPlanId}`,
      {
        body: deleteExercise,
      }
    );
  }

  createWorkoutPlan(
    workoutPlanData: ICreateWorkoutPlan
  ): Observable<HttpResponse<object>> {
    return this.httpClient.post(this.endpoint, workoutPlanData, {
      observe: 'response',
      responseType: 'json',
    });
  }

  addExercise(workoutPlanId: number, exercise: IAddExercise) {
    return this.httpClient.post<HttpResponse<object>>(
      `${this.endpoint}/${workoutPlanId}`,
      exercise,
      {
        observe: 'response',
      }
    );
  }

  constructor(private httpClient: HttpClient) {}
}
