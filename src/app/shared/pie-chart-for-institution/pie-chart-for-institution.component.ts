import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  constructor(private pagesService: PagesService) { }

  ngOnInit() {
    this.pagesService.getUsersDistributionByInstitution().subscribe(distributionByInstitution => {
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
