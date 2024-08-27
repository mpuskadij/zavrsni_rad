import { TestBed } from '@angular/core/testing';

import { FoodService } from './food.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FoodService', () => {
  let service: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(FoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
