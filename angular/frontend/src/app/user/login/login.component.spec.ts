import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { IUser } from 'src/interfaces/iuser';
import { UserService } from '../user-service/user.service';
import { of } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { FormsModule } from 'src/app/forms/forms.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavigationComponent,
        AppRoutingModule,
        HttpClientTestingModule,
        FormsModule,
      ],
      declarations: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('sendRegistrationCredentials', () => {
    it('should throw exception if username is missing', () => {
      const user: IUser = { username: '', password: 'akjldgkadgn23S' };
      component.sendRegistrationCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendRegistrationCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendRegistrationCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if there was an error on backend', () => {
      const user: IUser = { username: 'marin', password: '' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'register').and.throwError('Username already exists');
      component.sendRegistrationCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should not set error message if user registered', () => {
      const user: IUser = { username: 'marin', password: 'abcdefsa' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'register').and.returnValue(of());
      component.sendRegistrationCredentials(user);

      expect(component.errorMessage).toBeFalsy();
    });
  });

  describe('sendLoginCredentials', () => {
    it('should throw exception if username is missing', () => {
      const user: IUser = { username: '', password: 'akjldgkadgn23S' };
      component.sendLoginCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendLoginCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendLoginCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if there was an error on backend', () => {
      const user: IUser = { username: 'marin', password: '' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'login').and.throwError('Username already exists');
      component.sendLoginCredentials(user);

      expect(component.errorMessage).toBeTruthy();
    });

    it('should not set error message if user registered', () => {
      const user: IUser = { username: 'marin', password: 'abcdefsa' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'login').and.returnValue(of());
      component.sendRegistrationCredentials(user);

      expect(component.errorMessage).toBeFalsy();
    });
  });
});
