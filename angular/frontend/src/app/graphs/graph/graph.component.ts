import {
  Component,
  DoCheck,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
  chartOptions: ChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };
  chartDataset: ChartDataset = { data: [], label: 'BMI' };
  chartLabels: string[] = [];
  chartData: ChartData = {
    datasets: [],
    labels: this.chartLabels,
  };
  lineChartType: ChartType = 'line';
  barChartType: ChartType = 'bar';
  scatterChartType: ChartType = 'scatter';

  ngOnInit(): void {
    if (this.graphData && this.graphData.length) {
      const bmis = this.graphData.map((week) => week.bmi);
      const dates = this.graphData.map((week) =>
        week.dateAdded.toLocaleDateString()
      );

      this.chartDataset.data = bmis;
      this.chartLabels = dates;

      this.chartData.datasets = [this.chartDataset];
    }
  }
}
