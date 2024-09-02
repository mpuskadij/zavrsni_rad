import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IChangeActiveStatus } from 'src/interfaces/ichange-active-status';
import { IOffset } from 'src/interfaces/ioffset';

describe('AdminService', () => {
  let service: AdminService;
  let testingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });
    service = TestBed.inject(AdminService);
    testingController = TestBed.inject(HttpTestingController);
  });

  describe('getAllUsers', () => {
    it('should use http client to get data', () => {
      service.getAllUsers().subscribe();

      const request = testingController.expectOne(`${environment.apiUrl}users`);

      expect(request.request.method).toBe('GET');
    });
  });

  describe('changeStatus', () => {
    it('should throw exception if username is empty', () => {
      const data: IChangeActiveStatus = { username: '' };
      const result = () => service.changeStatus(data);
      expect(result).toThrow();
    });

    it('should use http client to update status', () => {
      const username = 'fake';
      service.changeStatus({ username: username }).subscribe();

      const request = testingController.expectOne(
        `${environment.apiUrl}users/${username}`
      );
      expect(request.request.method).toBe('PUT');
    });
  });

  describe('setOffset', () => {
    it('should throw exception if offset is NaN', () => {
      const data: IOffset = { offset: NaN };
      const result = () => service.setOffset(data);
      expect(result).toThrow();
    });

    it('should use http client to update status', () => {
      const offset: IOffset = { offset: 1 };
      service.setOffset(offset).subscribe();

      const request = testingController.expectOne(`${environment.apiUrl}time`);
      expect(request.request.body).not.toBeNull();
      expect(request.request.method).toBe('PUT');
    });
  });

  afterEach(() => {
    testingController.verify();
  });
});
