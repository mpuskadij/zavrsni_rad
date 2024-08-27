import { TestBed } from '@angular/core/testing';

import { NutritionService } from './nutrition.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NutritionService', () => {
  let service: NutritionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(NutritionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
