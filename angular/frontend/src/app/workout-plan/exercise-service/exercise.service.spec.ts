import { TestBed } from '@angular/core/testing';

import { ExerciseService } from './exercise.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExerciseService', () => {
  let service: ExerciseService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ExerciseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
