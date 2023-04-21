import { Component, Input, OnChanges } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-number-theory',
  templateUrl: './pie-chart-number-theory.component.html'
})
export class PieChartNumberTheoryComponent implements OnChanges {

  constructor(private pagesService: PagesService) { }

  @Input() dateStart: string;
  @Input() dateEnd: string;

  data: any;
  distributionByPerformance: Ranking[];

  ngOnChanges() {
    if(this.dateStart && this.dateEnd) {
      this.pagesService.getNumberTheoryPerformanceDistribution(this.dateStart, this.dateEnd).subscribe(distributionByPerformance => {
        this.distributionByPerformance = distributionByPerformance;
        this.data = {
          labels: GlobalConstants.getLabelsDistribution(this.distributionByPerformance),
          datasets: [{
            data: GlobalConstants.convertDistributionToArray(this.distributionByPerformance),
            backgroundColor: ["#44896A", "#D93661"]
          }]
        };
      })
    }
  }

}
