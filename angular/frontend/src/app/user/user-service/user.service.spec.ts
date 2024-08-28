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
  const registerUrl = `${environment.apiUrl}users/register`;
  const loginUrl = `${environment.apiUrl}users/login`;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('register', () => {
    it('should throw exception if username is falsy', () => {
      const user: IUser = { username: '', password: 'asfkjsan77A' };
      const result = () => service.register(user, '123');
      expect(result).toThrowError();
    });

    it('should throw exception if password is falsy', () => {
      const user: IUser = { username: 'marin', password: '' };
      const result = () => service.register(user, 'adasdas');

      expect(result).toThrowError();
    });

    it('should throw exception if token is falsy', () => {
      const user: IUser = { username: 'marin', password: 'asdasdas' };
      const result = () => service.register(user, '');

      expect(result).toThrowError();
    });

    it('should execute HTTP request when subscribed', () => {
      const user: IUser = { username: 'marin', password: 'asjfa9s9asS' };

      service.register(user, 'asdasd').subscribe();

      const request = httpTestingController.expectOne(registerUrl);
      const responseBody: IBackendError = {
        message: 'Username already exists',
      };
      request.flush(responseBody);

      expect(request.request.method).toEqual('POST');
      expect(request.request.headers.has('recaptcha')).toBe(true);
    });
  });

  describe('login', () => {
    it('should throw exception if username is falsy', () => {
      const user: IUser = { username: '', password: 'asfkjsan77A' };
      const result = () => service.login(user, '2qwdsdsaf');

      expect(result).toThrowError();
    });

    it('should throw exception if password is falsy', () => {
      const user: IUser = { username: 'marin', password: '' };
      const result = () => service.login(user, 'sadasda');

      expect(result).toThrowError();
    });

    it('should throw exception if token is falsy', () => {
      const user: IUser = { username: 'marin', password: 'asdasd' };
      const result = () => service.login(user, '');

      expect(result).toThrowError();
    });

    it('should execute HTTP request when subscribed', () => {
      const user: IUser = { username: 'marin', password: 'asjfa9s9asS' };

      service.login(user, 'asdasd').subscribe();

      const request = httpTestingController.expectOne(loginUrl);
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
