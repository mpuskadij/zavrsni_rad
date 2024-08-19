import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAndRegisterFormComponent } from './login-and-register-form/login-and-register-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginAndRegisterFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginAndRegisterFormComponent],
})
export class FormsModule {}
