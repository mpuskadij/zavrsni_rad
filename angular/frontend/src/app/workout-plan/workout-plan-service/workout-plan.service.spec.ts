import { TestBed } from '@angular/core/testing';

import { WorkoutPlanService } from './workout-plan.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('WorkoutPlanService', () => {
  let service: WorkoutPlanService;
  const apiEndpoint = `${environment.url}workout-plans`;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
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
