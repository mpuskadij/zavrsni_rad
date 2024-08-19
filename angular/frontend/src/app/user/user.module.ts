import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '../forms/forms.module';

@NgModule({
  declarations: [RegisterComponent],
  providers: [],
  imports: [CommonModule, FormsModule],
})
export class UserModule {}
