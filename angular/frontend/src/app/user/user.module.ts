import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../forms/forms.module';
import { UserService } from './user-service/user.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NavigationComponent } from '../navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  providers: [UserService, provideHttpClient(withFetch())],
  imports: [CommonModule, ReactiveFormsModule, NavigationComponent],
})
export class UserModule {}
