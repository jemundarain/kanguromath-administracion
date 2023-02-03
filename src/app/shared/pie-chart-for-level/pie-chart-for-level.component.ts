import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-for-level',
  templateUrl: './pie-chart-for-level.component.html'
})
export class PieChartForLevelComponent implements OnInit {

  data: any;
  distributionByLevel: Ranking[];

  constructor(private pagesService: PagesService) { }

  ngOnInit() {
    this.pagesService.getUsersDistributionByLevel().subscribe(distributionByLevel => {
      this.distributionByLevel = distributionByLevel.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0));
      this.data = {
        labels: GlobalConstants.getLabelsDistribution(this.distributionByLevel),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionByLevel),
          backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.LEVELS_COLORS).slice(0, GlobalConstants.getLabelsDistribution(this.distributionByLevel).length)
        }]
      };
    })
  }
}     