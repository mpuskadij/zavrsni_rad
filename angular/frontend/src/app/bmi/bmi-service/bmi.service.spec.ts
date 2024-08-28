import { TestBed } from '@angular/core/testing';

import { BmiService } from './bmi.service';
import { IBmi } from 'src/interfaces/ibmi';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('BmiService', () => {
  let service: BmiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(BmiService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('sendBmiData', () => {
    it('should throw exception if height less than 0', () => {
      const data: IBmi = { height: -1, weight: 50.3 };
      const result = () => service.sendBmiData(data);

      expect(result).toThrow();
    });

    it('should throw exception if weight less than 0', () => {
      const data: IBmi = { height: 150, weight: -1 };
      const result = () => service.sendBmiData(data);

      expect(result).toThrow();
    });

    it('should use http client to post data', () => {
      const data: IBmi = { height: 150, weight: 12 };
      service.sendBmiData(data).subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}bmi`
      );

      expect(request.request.method).toBe('POST');
    });
  });

  describe('getPreviousBmiEntries', () => {
    it('should use the http client to GET specific endpoint', () => {
      service.getPreviousBmiEntries().subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}bmi`
      );

      expect(request.request.method).toBe('GET');
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
