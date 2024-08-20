import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiComponent } from './bmi/bmi.component';

@NgModule({
  declarations: [BmiComponent],
  imports: [CommonModule],
  exports: [BmiComponent],
})
export class BmiModule {}
