import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-for-institution',
  templateUrl: './pie-chart-for-institution.component.html'
})
export class PieChartForInstitutionComponent implements OnInit {

  data: any;
  distributionByInstitution: Ranking[];

  constructor(private pagesService: PagesService) { }

  ngOnInit() {
    this.pagesService.getUsersDistributionByInstitution().subscribe(distributionByInstitution => {
      this.distributionByInstitution = distributionByInstitution;
      this.data = {
        labels: GlobalConstants.getLabelsDistribution(this.distributionByInstitution),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionByInstitution),
          backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.LEVELS_COLORS).slice(0, GlobalConstants.getLabelsDistribution(this.distributionByInstitution).length)
        }]
      };
    })
  }

}
