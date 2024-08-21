import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { GraphComponent } from './graph/graph.component';

@NgModule({
  declarations: [GraphComponent],
  imports: [BaseChartDirective, CommonModule],
  exports: [GraphComponent],
})
export class GraphsModule {}
