import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-geometria',
  templateUrl: './pie-chart-geometria.component.html'
})
export class PieChartGeometriaComponent implements OnInit {

  constructor(private pagesService: PagesService) { }
  
  data: any;
  distributionByPerformance: Ranking[];

  ngOnInit(): void {
  }

}
