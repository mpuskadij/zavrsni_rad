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

  constructor(private httpClient: HttpClient) {}

  getAllWorkoutPlans(): Observable<IWorkoutPlan[]> {
    return this.httpClient.get<IWorkoutPlan[]>(this.endpoint, {
      observe: 'body',
      responseType: 'json',
    });
  }

  getDetails(id: number) {
    if (isNaN(id)) {
      throw new Error('ID is invalid!');
    }
    return this.httpClient.get<IWorkoutPlanDetails>(`${this.endpoint}/${id}`, {
      observe: 'body',
      responseType: 'json',
    });
  }

  deleteWorkoutPlan(deleteWorkoutPlanData: IDeleteWorkoutPlan) {
    if (isNaN(deleteWorkoutPlanData.id)) {
      throw new Error('ID is invalid!');
    }
    return this.httpClient.delete<HttpResponse<object>>(`${this.endpoint}`, {
      body: deleteWorkoutPlanData,
      observe: 'response',
    });
  }

  deleteExercise(workoutPlanId: number, deleteExercise: IDeleteExercise) {
    if (isNaN(workoutPlanId)) {
      throw new Error('Invalid workout plan ID!');
    }
    if (!deleteExercise.name.length) {
      throw new Error('Exercise name not valid!');
    }
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
    if (!workoutPlanData.title.length) {
      throw new Error('Title is empty!');
    }
    return this.httpClient.post(this.endpoint, workoutPlanData, {
      observe: 'response',
      responseType: 'json',
    });
  }

  addExercise(workoutPlanId: number, exercise: IAddExercise) {
    if (isNaN(workoutPlanId)) {
      throw new Error('Invalid workout plan ID!');
    }
    if (!exercise.name.length) {
      throw new Error('Exercise name not valid!');
    }
    return this.httpClient.post<HttpResponse<object>>(
      `${this.endpoint}/${workoutPlanId}`,
      exercise,
      {
        observe: 'response',
      }
    );
  }
}
