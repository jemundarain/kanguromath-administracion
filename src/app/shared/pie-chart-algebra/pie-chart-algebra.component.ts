import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-algebra',
  templateUrl: './pie-chart-algebra.component.html'
})
export class PieChartAlgebraComponent implements OnChanges {

  constructor(
    private pagesService: PagesService
  ) { }
  
  @Input() dateStart: string;
  @Input() dateEnd: string;
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();
  data: any;
  distributionByPerformance: Ranking[];

  ngOnChanges() {
    if(this.dateStart && this.dateEnd) {
      this.pagesService.getAlgebraPerformanceDistribution(this.dateStart, this.dateEnd).subscribe(distributionByPerformance => {
        this.distributionByPerformance = distributionByPerformance;
        this.data = {
          labels: GlobalConstants.getDistributionLabels(this.distributionByPerformance, GlobalConstants.PERFORMANCE_OPTIONS),
          datasets: [{
            data: GlobalConstants.convertDistributionToArray(this.distributionByPerformance),
            backgroundColor: ["#44896A", "#D93661"]
          }]
        };
        this.onLoadComplete.emit(true);
      })
    }
  }

}
