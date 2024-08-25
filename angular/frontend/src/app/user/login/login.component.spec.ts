import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { IUser } from 'src/interfaces/iuser';
import { UserService } from '../user-service/user.service';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { FormsModule } from 'src/app/forms/forms.module';
import { ILoginData } from 'src/interfaces/ilogin-data';
import { ReactiveFormsModule } from '@angular/forms';
import {
  RECAPTCHA_V3_SITE_KEY,
  ReCaptchaV3Service,
  RecaptchaV3Module,
} from 'ng-recaptcha';
import { environment } from '../../../environments/environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let captchaService: ReCaptchaV3Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavigationComponent,
        AppRoutingModule,
        HttpClientTestingModule,
        RecaptchaV3Module,
        ReactiveFormsModule,
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.site_key },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    captchaService = TestBed.inject(ReCaptchaV3Service);
    fixture.detectChanges();
  });

  describe('sendRegistrationCredentials', () => {
    it('should throw exception if username is missing', () => {
      const user: IUser = { username: '', password: 'akjldgkadgn23S' };
      component.sendRegistrationCredentials(user, 'asdasd');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendRegistrationCredentials(user, 'asdasd');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if token is missing', () => {
      const user: IUser = { username: 'marin', password: 'asdasdasd' };
      component.sendRegistrationCredentials(user, '');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if there was an error on backend', () => {
      const user: IUser = { username: 'marin', password: '' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'register').and.throwError('Username already exists');
      component.sendRegistrationCredentials(user, 'asdasd');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should not set error message if user registered', () => {
      const user: IUser = { username: 'marin', password: 'abcdefsa' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'register').and.returnValue(of());
      component.sendRegistrationCredentials(user, 'asdasdasda');

      expect(component.errorMessage).toBeFalsy();
    });
  });

  describe('sendLoginCredentials', () => {
    it('should throw exception if username is missing', () => {
      const user: IUser = { username: '', password: 'akjldgkadgn23S' };
      component.sendLoginCredentials(user, 'asdasdas');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if password is missing', () => {
      const user: IUser = { username: 'marin', password: '' };
      component.sendLoginCredentials(user, 'asdasda');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should throw exception if token is missing', () => {
      const user: IUser = { username: 'marin', password: 'asdasda' };
      component.sendLoginCredentials(user, '');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if there was an error on backend', () => {
      const user: IUser = { username: 'marin', password: '' };
      const userService = TestBed.inject(UserService);
      spyOn(userService, 'login').and.throwError('Username already exists');
      component.sendLoginCredentials(user, 'asdasd');

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set session storage isAdmin based on response', () => {
      const user: IUser = { username: 'marin', password: 'abcdefsa' };
      const userService = TestBed.inject(UserService);
      const loginData: ILoginData = { isAdmin: false };
      spyOn(userService, 'login').and.returnValue(of(loginData));
      component.sendLoginCredentials(user, 'sdasda');

      expect(sessionStorage.getItem('isAdmin')).toBeTruthy();
      expect(sessionStorage.getItem('isAdmin')).toEqual('false');
    });
  });

  describe('register', () => {
    it('should set error message if username is empty', () => {
      component.form.controls.username.setValue('');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password is empty', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if username is 4 characters long', () => {
      component.form.controls.username.setValue('mari');
      component.form.controls.password.setValue('abchE8jh');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if username is 26 characters long', () => {
      component.form.controls.username.setValue('pckhxatqkhhkphvbpflywaclwi');
      component.form.controls.password.setValue('abchE8jh');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if username only contains numbers', () => {
      component.form.controls.username.setValue('1231231223');
      component.form.controls.password.setValue('abchE8jh');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password is 7 characters long', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('abcdefg');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password is only numbers', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('12345678');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should set error message if password doesnt contain uppercase character', () => {
      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('1234567s');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });

    it('should call recaptcha service if form is valid', () => {
      const token = '123123123';
      spyOn(captchaService, 'execute').and.returnValue(of(token));

      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('1234567S');
      component.register();

      expect(captchaService.execute).toHaveBeenCalled();
    });

    it('should call sendRegistrationCredentials if form is valid and token is passed', () => {
      const token = '123123123';
      spyOn(captchaService, 'execute').and.returnValue(of(token));
      spyOn(component, 'sendRegistrationCredentials').and.returnValue();

      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('1234567S');
      component.register();

      expect(component.sendRegistrationCredentials).toHaveBeenCalled();
    });

    it('should set error message if there was an recaptcha error', () => {
      const token = '123123123';
      spyOn(captchaService, 'execute').and.returnValue(
        throwError(() => new Error('Recaptcha error!'))
      );

      component.form.controls.username.setValue('marin');
      component.form.controls.password.setValue('1234567S');
      component.register();

      expect(component.errorMessage).toBeTruthy();
    });
  });
});
