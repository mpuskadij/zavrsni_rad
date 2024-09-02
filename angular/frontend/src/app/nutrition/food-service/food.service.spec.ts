import { TestBed } from '@angular/core/testing';

import { FoodService } from './food.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { IFoodSearchQuery } from 'src/interfaces/ifood-search-query';
import { environment } from 'src/environments/environment';

describe('FoodService', () => {
  let service: FoodService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FoodService],
    });
    service = TestBed.inject(FoodService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('searchFood', () => {
    it('should throw exception if search term is empty', () => {
      const data: IFoodSearchQuery = { searchTerm: '' };

      const result = () => service.searchFood(data);

      expect(result).toThrow();
    });

    it('should set query params to GET data using http client', () => {
      const data: IFoodSearchQuery = { searchTerm: 'blah' };

      service.searchFood(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}food?searchTerm=blah`
      );

      expect(request.request.method).toBe('GET');
      expect(request.request.params.has('searchTerm')).toBeTrue();

      expect(request.request.params.get('searchTerm')).toBe('blah');
    });
  });

  describe('getDetails', () => {
    it('should throw error if parameter name is empty', () => {
      const result = () => service.getDetails('', 'abc');

      expect(result).toThrow();
    });

    it('should throw error if parameter name is incorrect', () => {
      const result = () => service.getDetails('asdasda', 'abc');

      expect(result).toThrow();
    });

    it('should throw error if parameter value is empty', () => {
      const result = () => service.getDetails('id', '');

      expect(result).toThrow();
    });

    it('should set query params with id to GET details using http client', () => {
      service.getDetails('id', '1').subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}food/details?id=1`
      );

      expect(request.request.method).toBe('GET');
      expect(request.request.params.has('id')).toBeTrue();

      expect(request.request.params.get('id')).toBe('1');
    });

    it('should set query params with name to GET details using http client', () => {
      service.getDetails('name', 'burger').subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}food/details?name=burger`
      );

      expect(request.request.method).toBe('GET');
      expect(request.request.params.has('name')).toBeTrue();

      expect(request.request.params.get('name')).toBe('burger');
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
