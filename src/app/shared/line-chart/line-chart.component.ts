import { Component, Input, OnInit } from "@angular/core";
import Chart from 'chart.js/auto';
import { ChartDataset } from 'chart.js';

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
})
export class LineChartComponent implements OnInit {
  constructor() { }
  public chart: any;
  @Input() labels: string[] = [];
  @Input() datasets: ChartDataset[] = [];
  
  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
    this.chart = new Chart("line-chart", {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: {
        aspectRatio:4.5,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}
