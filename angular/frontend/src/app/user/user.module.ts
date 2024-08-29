import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../forms/forms.module';
import { UserService } from './user-service/user.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NavigationComponent } from '../navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [LoginComponent],
  providers: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavigationComponent,
    RecaptchaV3Module,
  ],
  exports: [LoginComponent],
})
export class UserModule {}
