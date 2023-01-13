import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart-for-level',
  templateUrl: './pie-chart-for-level.component.html'
})
export class PieChartForLevelComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  public chart: any;

  createChart(){
    this.chart = new Chart("pie-chart-forLevel", {
      type: 'pie',
      data: {
        labels: ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"],
        datasets: [{
          label: "Usuarios",
          backgroundColor: ["#0897FB", "#2a5116","#124f9f","#a2Fcb9","#199250"],
          data: [2478,5267,734,784,433]
        }]
      }
    });
  }

}