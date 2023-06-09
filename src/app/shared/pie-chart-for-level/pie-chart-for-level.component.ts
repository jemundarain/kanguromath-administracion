import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';
import { PagesService } from 'src/app/pages/services/pages.service';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';

@Component({
  selector: 'app-pie-chart-for-level',
  templateUrl: './pie-chart-for-level.component.html'
})
export class PieChartForLevelComponent implements OnInit {

  constructor(private pagesService: PagesService) { }

  data: any;
  distributionByLevel: Ranking[];
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    this.pagesService.getUsersDistributionByLevel().subscribe(distributionByLevel => {
      this.distributionByLevel = distributionByLevel;
      this.data = {
        labels: GlobalConstants.getDistributionLabels(this.distributionByLevel, GlobalConstants.DISTRIBUTION_LEVELS),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionByLevel),
          backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.LEVELS_COLORS)
        }]
      };
      this.onLoadComplete.emit(true);
    })
  }
}     