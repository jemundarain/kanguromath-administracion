import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js/auto';

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
})
export class LineChartComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }
  public chart: any;

  createChart(){
    this.chart = new Chart("line-chart", {
      type: 'line',

      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "dddd",
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: [65, 78, 66, 44, 56, 67, 75],
            fill: false,
          }
        ],
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
