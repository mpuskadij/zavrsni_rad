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

  afterEach(() => {
    httpTestingController.verify();
  });
});
