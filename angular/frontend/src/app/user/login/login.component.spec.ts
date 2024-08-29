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

  describe('UserComponent', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});
