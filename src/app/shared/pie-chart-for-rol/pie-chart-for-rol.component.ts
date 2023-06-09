import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from '../../pages/services/pages.service';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-pie-chart-for-rol',
  templateUrl: './pie-chart-for-rol.component.html'
})
export class PieChartForRolComponent implements OnInit {

  data: any;
  distributionByType: Ranking[];
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();
  
  constructor(
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.pagesService.getUsersDistributionByType().subscribe(distributionByType => {
      this.distributionByType = distributionByType.sort((a,b) => (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0));
      this.data = {
        labels: GlobalConstants.getDistributionLabels(this.distributionByType, GlobalConstants.USER_ROLS),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionByType),
          backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.TYPES_COLORS).slice(0, GlobalConstants.getDistributionLabels(this.distributionByType, GlobalConstants.USER_ROLS).length)
        }]
      };
      this.onLoadComplete.emit(true);
    })
  }
}
