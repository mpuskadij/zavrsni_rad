import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { IUser } from 'src/interfaces/iuser';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
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
  });
});
