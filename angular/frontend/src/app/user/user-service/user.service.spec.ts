import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { IUser } from 'src/interfaces/iuser';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { IBackendError } from 'src/interfaces/ibackend-error';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const registerUrl = `${environment.url}api/users/register`;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('register', () => {
    it('should throw exception if username is falsy', () => {
      const user: IUser = { username: '', password: 'asfkjsan77A' };
      const result = () => service.register(user);

      expect(result).toThrowError();
    });

    it('should throw exception if password is falsy', () => {
      const user: IUser = { username: 'marin', password: '' };
      const result = () => service.register(user);

      expect(result).toThrowError();
    });

    it('should execute HTTP request when subscribed', () => {
      const user: IUser = { username: 'marin', password: 'asjfa9s9asS' };

      service.register(user).subscribe();

      const request = httpTestingController.expectOne(registerUrl);
      const responseBody: IBackendError = {
        message: 'Username already exists',
      };
      request.flush(responseBody);

      expect(request.request.method).toEqual('POST');
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
