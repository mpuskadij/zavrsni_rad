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

    it('should contain bar chart when input property passed', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const bmiData: IBmiGraphData = { bmi: 17.5, dateAdded: new Date() };
      component.graphData = [bmiData];

      const lineChart = ui.querySelector('canvas[id="barChart"]');
      expect(lineChart).not.toBeNull();
    });

    it('should contain scatter chart when input property passed', () => {
      const ui: HTMLElement = fixture.nativeElement;
      const bmiData: IBmiGraphData = { bmi: 17.5, dateAdded: new Date() };
      component.graphData = [bmiData];

      const lineChart = ui.querySelector('canvas[id="scatterChart"]');
      expect(lineChart).not.toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should not extract data from input property if input property is undefined', () => {
      component.graphData = undefined;
      component.ngOnInit();

      expect(component.chartData.datasets.length).toBe(0);
    });

    it('should not extract data from input property if input property is empty', () => {
      component.graphData = [];
      component.ngOnInit();

      expect(component.chartData.datasets.length).toBe(0);
    });

    it('should extract data from input property and place it into datasets', () => {
      component.graphData = [{ bmi: 1, dateAdded: new Date() }];

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.chartData.datasets.length).toBe(1);
    });
  });
});
