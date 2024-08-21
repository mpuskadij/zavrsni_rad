import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphComponent } from './graph.component';
import { IBmiGraphData } from 'src/interfaces/ibmi-graph-data';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphComponent],
      imports: [BaseChartDirective],
      providers: [provideCharts(withDefaultRegisterables())],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI', () => {
    it('should contain line chart when input property passed', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const bmiData: IBmiGraphData = { bmi: 17.5, dateAdded: new Date() };
      component.graphData = [bmiData];

      const lineChart = ui.querySelector('canvas[id="lineChart"]');
      expect(lineChart).not.toBeNull();
    });
  });
});
