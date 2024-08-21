import { Component, Input, OnInit } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  LabelItem,
} from 'chart.js';
import { IBmiGraphData } from 'src/interfaces/ibmi-graph-data';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent implements OnInit {
  @Input({ required: true }) graphData?: IBmiGraphData[];
  chartOptions: ChartOptions = { responsive: true };
  lineChartDataSet: ChartDataset = { data: [], label: 'Your BMI over time' };
  lineChartLabels: string[] = [];
  lineChartData: ChartData = {
    datasets: [this.lineChartDataSet],
    labels: this.lineChartLabels,
  };
  lineChartType: ChartType = 'line';

  ngOnInit(): void {
    if (this.graphData) {
      const bmis = this.graphData.map((week) => week.bmi);
      const dates = this.graphData.map((week) =>
        week.dateAdded.toLocaleDateString()
      );

      this.lineChartDataSet.data = bmis;
      this.lineChartLabels = dates;
    }
  }
}
