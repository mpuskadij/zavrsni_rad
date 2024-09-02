import { TestBed } from '@angular/core/testing';

import { WorkoutPlanService } from './workout-plan.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('WorkoutPlanService', () => {
  let service: WorkoutPlanService;
  const apiEndpoint = `${environment.apiUrl}workout-plans`;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkoutPlanService],
    });
    service = TestBed.inject(WorkoutPlanService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getAllWorkoutPlans', () => {
    it('should use http client to GET ' + apiEndpoint, () => {
      service.getAllWorkoutPlans().subscribe();
      const request = httpTestingController.expectOne(apiEndpoint);

      expect(request.request.method).toBe('GET');
    });
  });

  describe('getDetails', () => {
    it('should throw error if id is NaN', () => {
      const result = () => service.getDetails(NaN);

      expect(result).toThrow();
    });

    it('should GET details if id is a number', () => {
      const id = 1;
      service.getDetails(1).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}workout-plans/${id}`
      );
      expect(request.request.method).toBe('GET');
    });
  });

  describe('deleteWorkoutPlan', () => {
    it('should throw error if id is NaN', () => {
      const result = () => service.deleteWorkoutPlan({ id: NaN });

      expect(result).toThrow();
    });

    it('should DELETE workout plan if id is a number', () => {
      const id = 1;
      service.deleteWorkoutPlan({ id: 1 }).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}workout-plans`
      );
      expect(request.request.method).toBe('DELETE');
      expect(request.request.body).not.toBeNull();
    });
  });

  describe('deleteExercise', () => {
    it('should throw error if workout plan id is NaN', () => {
      const result = () => service.deleteExercise(NaN, { name: '2sadasdas' });

      expect(result).toThrow();
    });

    it('should throw error if exercise name is empty', () => {
      const result = () => service.deleteExercise(1, { name: '' });

      expect(result).toThrow();
    });

    it('should DELETE exercise if id is a number and exercise name is correct', () => {
      const id = 1;
      service.deleteExercise(id, { name: 'hamburger' }).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}workout-plans/${id}`
      );
      expect(request.request.method).toBe('DELETE');
      expect(request.request.body).not.toBeNull();
    });
  });

  describe('createWorkoutPlan', () => {
    it('should throw error if title is empty', () => {
      const result = () => service.createWorkoutPlan({ title: '' });

      expect(result).toThrow();
    });

    it('should POST workout plan data if title is provided', () => {
      service.createWorkoutPlan({ title: 'Batman' }).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}workout-plans`
      );
      expect(request.request.method).toBe('POST');
      expect(request.request.body).not.toBeNull();
    });
  });

  describe('addExercise', () => {
    it('should throw error if workout plan id is NaN', () => {
      const result = () => service.addExercise(NaN, { name: '2sadasdas' });

      expect(result).toThrow();
    });

    it('should throw error if exercise name is empty', () => {
      const result = () => service.addExercise(1, { name: '' });

      expect(result).toThrow();
    });

    it('should POST exercise if id is a number and exercise name is correct', () => {
      const id = 1;
      service.addExercise(id, { name: 'hamburger' }).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}workout-plans/${id}`
      );
      expect(request.request.method).toBe('POST');
      expect(request.request.body).not.toBeNull();
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
