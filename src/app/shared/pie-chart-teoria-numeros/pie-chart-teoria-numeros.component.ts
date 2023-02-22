import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-teoria-numeros',
  templateUrl: './pie-chart-teoria-numeros.component.html'
})
export class PieChartTeoriaNumerosComponent implements OnInit {

  constructor(private pagesService: PagesService) { }
  
  data: any;
  distributionByPerformance: Ranking[];

  ngOnInit(): void {
  }

}
