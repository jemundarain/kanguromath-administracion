import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-for-sex',
  templateUrl: './pie-chart-for-sex.component.html'
})
export class PieChartForSexComponent implements OnInit {
  
  data: any;
  distributionBySex: Ranking[];
  chartOptions: any;
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private pagesService: PagesService
  ) {}
  
  ngOnInit() {
    this.pagesService.getUsersDistributionBySex().subscribe(distributionBySex => {
      this.distributionBySex = distributionBySex.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0));
      this.data = {
        labels: GlobalConstants.getDistributionLabels(this.distributionBySex, GlobalConstants.SEXS),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionBySex),
          backgroundColor: ["#D93661", "#0777BF"]
        }]
      };
      this.onLoadComplete.emit(true);
    })
  }
}
