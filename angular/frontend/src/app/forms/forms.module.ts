import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAndRegisterFormComponent } from './login-and-register-form/login-and-register-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewBmiEntryFormComponent } from './new-bmi-entry-form/new-bmi-entry-form.component';

@NgModule({
  declarations: [LoginAndRegisterFormComponent, NewBmiEntryFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [LoginAndRegisterFormComponent, NewBmiEntryFormComponent],
})
export class FormsModule {}
