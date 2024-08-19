import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { IUser } from '../../../interfaces/iuser';
import { FormsModule } from '../../forms/forms.module';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { UserService } from '../user-service/user.service';
import { of } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [RegisterComponent],
    });
    fixture = TestBed.createComponent(RegisterComponent);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('sendCredentials', () => {
    it('should throw exception if username is missing', () => {
      const user: IUser = { username: '', password: 'akjldgkadgn23S' };
      component.sendCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if there was an error on backend', () => {
      const user: IUser = { username: 'marin', password: '' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'register').and.throwError('Username already exists');
      component.sendCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should not set error message if user registered', () => {
      const user: IUser = { username: 'marin', password: 'abcdefsa' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'register').and.returnValue(of());
      component.sendCredentials(user);

      expect(component.errorMessage).toBeFalsy();
    });
  });
});
