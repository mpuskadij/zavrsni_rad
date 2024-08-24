import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BmiComponent } from './bmi/bmi.component';
import { FormsModule } from '../forms/forms.module';
import { GraphsModule } from '../graphs/graphs.module';
import { NavigationComponent } from '../navigation/navigation.component';
import { BaseChartDirective } from 'ng2-charts';
import { TimeModule } from '../time/time.module';

@NgModule({
  declarations: [BmiComponent],
  imports: [
    CommonModule,
    FormsModule,
    GraphsModule,
    NavigationComponent,
    TimeModule,
  ],
  exports: [BmiComponent],
})
export class BmiModule {}
