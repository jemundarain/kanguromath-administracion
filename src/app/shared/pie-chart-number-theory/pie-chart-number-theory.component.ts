import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-number-theory',
  templateUrl: './pie-chart-number-theory.component.html'
})
export class PieChartNumberTheoryComponent implements OnChanges {

  constructor(private pagesService: PagesService) { }

  data: any;
  distributionByPerformance: Ranking[];

  @Input() dateStart: string;
  @Input() dateEnd: string;
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  ngOnChanges() {
    if(this.dateStart && this.dateEnd) {
      this.pagesService.getNumberTheoryPerformanceDistribution(this.dateStart, this.dateEnd).subscribe(distributionByPerformance => {
        this.distributionByPerformance = distributionByPerformance;
        this.data = {
          labels: GlobalConstants.getDistributionLabels(this.distributionByPerformance, GlobalConstants.PERFORMANCE_OPTIONS),
          datasets: [{
            data: GlobalConstants.convertDistributionToArray(this.distributionByPerformance),
            backgroundColor: ["#44896A", "#D93661"]
          }]
        };
      })
      this.onLoadComplete.emit(true);
    }
  }

}
