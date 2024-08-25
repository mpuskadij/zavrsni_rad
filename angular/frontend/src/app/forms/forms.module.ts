import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NewBmiEntryFormComponent } from './new-bmi-entry-form/new-bmi-entry-form.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [NewBmiEntryFormComponent],
  imports: [CommonModule, ReactiveFormsModule, RecaptchaV3Module],
  exports: [NewBmiEntryFormComponent],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.site_key },
  ],
})
export class FormsModule {}
