import { TestBed } from '@angular/core/testing';

import { ExerciseService } from './exercise.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ISearchExercise } from 'src/interfaces/isearch-exercise';
import { environment } from 'src/environments/environment';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExerciseService],
    });
    service = TestBed.inject(ExerciseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('search', () => {
    it('should throw exception if only page provided', () => {
      const data: ISearchExercise = {
        category: '',
        equipment: '',
        page: 1,
        searchTerm: '',
      };
      const result = () => service.search(data);

      expect(result).toThrow();
    });

    it('should throw exception if page is NaN', () => {
      const data: ISearchExercise = {
        category: 'asdasd',
        equipment: 'asdasd',
        page: NaN,
        searchTerm: 'asdasd',
      };
      const result = () => service.search(data);

      expect(result).toThrow();
    });

    it('should throw exception if page is 0', () => {
      const data: ISearchExercise = {
        category: 'asdasd',
        equipment: 'asdasd',
        page: 0,
        searchTerm: 'asdasd',
      };
      const result = () => service.search(data);

      expect(result).toThrow();
    });

    it('should throw exception if page is negative', () => {
      const data: ISearchExercise = {
        category: 'asdasd',
        equipment: 'asdasd',
        page: -1,
        searchTerm: 'asdasd',
      };
      const result = () => service.search(data);

      expect(result).toThrow();
    });

    it('should set query params if name and page passed', () => {
      const data: ISearchExercise = {
        category: '',
        equipment: '',
        page: 1,
        searchTerm: 'asdasd',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&searchTerm=${data.searchTerm}`
      );
      expect(request.request.method).toBe('GET');
    });

    it('should set query params if equipment and page passed', () => {
      const data: ISearchExercise = {
        category: '',
        equipment: 'asdasd',
        page: 1,
        searchTerm: '',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&equipment=${data.equipment}`
      );
      expect(request.request.method).toBe('GET');
    });

    it('should set query params if equipment and category passed', () => {
      const data: ISearchExercise = {
        category: 'sdasdasd',
        equipment: '',
        page: 1,
        searchTerm: '',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&category=${data.category}`
      );
      expect(request.request.method).toBe('GET');
    });

    it('should set query params if page,searchTerm and category passed', () => {
      const data: ISearchExercise = {
        category: 'sdasdasd',
        equipment: '',
        page: 1,
        searchTerm: 'asdasa',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&searchTerm=${data.searchTerm}&category=${data.category}`
      );
      expect(request.request.method).toBe('GET');
    });

    it('should set query params if page,searchTerm and equipment passed', () => {
      const data: ISearchExercise = {
        category: '',
        equipment: 'sdasdasd',
        page: 1,
        searchTerm: 'asdasa',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&searchTerm=${data.searchTerm}&equipment=${data.equipment}`
      );
      expect(request.request.method).toBe('GET');
    });

    it('should set query params if page,category and equipment passed', () => {
      const data: ISearchExercise = {
        category: 'adasdasada',
        equipment: 'sdasdasd',
        page: 1,
        searchTerm: '',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&category=${data.category}&equipment=${data.equipment}`
      );
      expect(request.request.method).toBe('GET');
    });

    it('should set query params if page,category,equipment and search term passed', () => {
      const data: ISearchExercise = {
        category: 'adasdasada',
        equipment: 'sdasdasd',
        page: 1,
        searchTerm: 'asdasdasda',
      };
      service.search(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}exercise?page=${data.page}&searchTerm=${data.searchTerm}&category=${data.category}&equipment=${data.equipment}`
      );
      expect(request.request.method).toBe('GET');
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
