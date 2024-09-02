import { TestBed } from '@angular/core/testing';

import { NutritionService } from './nutrition.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAddFoodToNutrition } from 'src/interfaces/iadd-food-to-nutrition';

describe('NutritionService', () => {
  let service: NutritionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NutritionService],
    });
    service = TestBed.inject(NutritionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getNutrition', () => {
    it('should use http client to GET data', () => {
      service.getNutrition().subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}nutrition/`
      );

      expect(request.request.method).toBe('GET');
    });
  });

  describe('deleteFood', () => {
    it('should throw exception is id is NaN', () => {
      const result = () => service.deleteFood(NaN);
      expect(result).toThrow();
    });

    it('should use http client to DELETE food', () => {
      const id = 1;
      service.deleteFood(id).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}nutrition/${id}`
      );

      expect(request.request.method).toBe('DELETE');
    });
  });

  describe('addToNutrition', () => {
    it('should throw exception is id is empty', () => {
      const result = () => service.addToNutrition({ id: '' });
      expect(result).toThrow();
    });
    it('should throw exception is name is empty', () => {
      const result = () => service.addToNutrition({ name: '' });
      expect(result).toThrow();
    });

    it('should use http client to POST food with id to nutrition', () => {
      const data: IAddFoodToNutrition = { id: '1' };
      service.addToNutrition(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}nutrition/`
      );

      expect(request.request.method).toBe('POST');
      expect(request.request.body).not.toBeNull();
    });

    it('should use http client to POST food with name to nutrition', () => {
      const data: IAddFoodToNutrition = { name: '1' };
      service.addToNutrition(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}nutrition/`
      );

      expect(request.request.method).toBe('POST');
      expect(request.request.body).not.toBeNull();
    });
  });

  describe('updateQuantity', () => {
    it('should throw exception is array is empty', () => {
      const result = () => service.updateQuantity({ foods: [] });
      expect(result).toThrow();
    });

    it('should throw exception is one item has negative number as quantity', () => {
      const result = () =>
        service.updateQuantity({ foods: [{ id: 2, quantity: -1 }] });
      expect(result).toThrow();
    });

    it('should throw exception is one item has 0 as quantity', () => {
      const result = () =>
        service.updateQuantity({ foods: [{ id: 2, quantity: 0 }] });
      expect(result).toThrow();
    });

    it('should throw exception is one item has Nan as id', () => {
      const result = () =>
        service.updateQuantity({ foods: [{ id: NaN, quantity: 0 }] });
      expect(result).toThrow();
    });

    it('should use http client to PUT food quantity', () => {
      service.updateQuantity({ foods: [{ id: 1, quantity: 2 }] }).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}nutrition/`
      );

      expect(request.request.method).toBe('PUT');
      expect(request.request.body).not.toBeNull();
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
