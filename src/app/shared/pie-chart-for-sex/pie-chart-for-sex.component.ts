import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-for-sex',
  templateUrl: './pie-chart-for-sex.component.html'
})
export class PieChartForSexComponent implements OnInit {

  constructor(private pagesService: PagesService) { }
  
  data: any;
  distributionBySex: Ranking[];
  
  ngOnInit() {
    this.pagesService.getUsersDistributionBySex().subscribe(distributionBySex => {
      this.distributionBySex = distributionBySex.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0));
      this.data = {
        labels: GlobalConstants.getLabelsDistribution(this.distributionBySex),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionBySex),
          backgroundColor: ["#D93661", "#0777BF"]
        }]
      };
    })
  }

}
