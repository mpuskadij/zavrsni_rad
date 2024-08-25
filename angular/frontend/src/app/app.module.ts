import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { UserModule } from './user/user.module';
import { NavigationComponent } from './navigation/navigation.component';
import { BmiModule } from './bmi/bmi.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './user/login/login.component';
import { UserService } from './user/user-service/user.service';
import { BmiService } from './bmi/bmi-service/bmi.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    NavigationComponent,
    BmiModule,
    RecaptchaV3Module,
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideCharts(withDefaultRegisterables()),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.site_key },
    UserService,
    BmiService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
