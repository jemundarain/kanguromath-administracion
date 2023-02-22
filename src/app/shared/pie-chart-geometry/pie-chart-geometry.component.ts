import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-geometry',
  templateUrl: './pie-chart-geometry.component.html'
})
export class PieChartGeometryComponent implements OnInit {

  constructor(private pagesService: PagesService) { }
  
  data: any;
  distributionByPerformance: Ranking[];

  ngOnInit(): void {
  }

}
