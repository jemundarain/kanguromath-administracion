import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';
import { PageService } from 'src/app/pages/services/page.service';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pie-chart-for-level',
  templateUrl: './pie-chart-for-level.component.html'
})
export class PieChartForLevelComponent implements OnInit {

  constructor(private pageService: PageService) { }

  data: any;
  distributionByLevel: Ranking[];
  plugins = [ChartDataLabels];
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();
  
  ngOnInit() {
    this.pageService.getUsersDistributionByLevel().subscribe(distributionByLevel => {
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