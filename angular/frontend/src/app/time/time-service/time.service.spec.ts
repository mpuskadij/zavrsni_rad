import { TestBed } from '@angular/core/testing';

import { TimeService } from './time.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { IServerTime } from 'src/interfaces/iserver-time';

describe('TimeService', () => {
  let service: TimeService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TimeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getServerTime', () => {
    it('should fetch server time using http client', () => {
      service.getServerTime().subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}time`
      );

      expect(request.request.method).toBe('GET');
    });

    it('should fetch server time with credentials', () => {
      service.getServerTime().subscribe();

      const request = httpTestingController.expectOne(
        `${environment.apiUrl}time`
      );

      expect(request.request.withCredentials).toBe(true);
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
