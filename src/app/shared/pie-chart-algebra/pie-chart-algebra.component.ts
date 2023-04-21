import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-algebra',
  templateUrl: './pie-chart-algebra.component.html'
})
export class PieChartAlgebraComponent implements OnChanges {

  constructor(private pagesService: PagesService) { }
  
  @Input() dateStart: string;
  @Input() dateEnd: string;

  data: any;
  distributionByPerformance: Ranking[];
  
  ngOnChanges() {
    if(this.dateStart && this.dateEnd) {
      this.pagesService.getAlgebraPerformanceDistribution(this.dateStart, this.dateEnd).subscribe(distributionByPerformance => {
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
