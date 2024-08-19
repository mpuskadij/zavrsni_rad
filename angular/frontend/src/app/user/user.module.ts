import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '../forms/forms.module';
import { UserService } from './user-service/user.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NavigationComponent } from '../navigation/navigation.component';

@NgModule({
  declarations: [RegisterComponent],
  providers: [UserService, provideHttpClient(withFetch())],
  imports: [CommonModule, FormsModule, NavigationComponent],
})
export class UserModule {}
