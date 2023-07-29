import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PageService } from 'src/app/pages/services/page.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pie-chart-for-institution',
  templateUrl: './pie-chart-for-institution.component.html'
})
export class PieChartForInstitutionComponent implements OnInit {

  data: any;
  plugins = [ChartDataLabels];
  distributionByInstitution: Ranking[];
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private pageService: PageService
  ) { }

  ngOnInit() {
    this.pageService.getUsersDistributionByInstitution().subscribe(distributionByInstitution => {
      this.distributionByInstitution = distributionByInstitution;
      this.data = {
        labels: GlobalConstants.getDistributionLabels(this.distributionByInstitution, GlobalConstants.INSTITUTIONS),
        datasets: [{
          data: GlobalConstants.convertDistributionToArray(this.distributionByInstitution),
          backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.LEVELS_COLORS).slice(0, GlobalConstants.getDistributionLabels(this.distributionByInstitution, GlobalConstants.INSTITUTIONS).length)
        }]
      };
      this.onLoadComplete.emit(true);
    })
  }
}
