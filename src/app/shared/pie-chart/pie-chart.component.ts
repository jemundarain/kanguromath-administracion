import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartItem } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }
  public chart: any;
  @Input() public id: ChartItem = "";

  createChart(){
    this.chart = new Chart(this.id, {
      type: 'pie',
      data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
      }]
    }
    });
  }
}
