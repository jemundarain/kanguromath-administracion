import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart-for-rol',
  templateUrl: './pie-chart-for-rol.component.html'
})
export class PieChartForRolComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  public chart: any;

  createChart(){
    this.chart = new Chart("pie-chart-forRol",  {
      type: 'pie',
      data: {
        labels: ["Estudiante", "Profesor", "Aficionado"],
        datasets: [{
          label: "Usuarios",
          backgroundColor: ["#0897fB", "#3a5e16","#3cba9f"],
          data: [2478,784,433]
        }]
      }
    });
  }
}
