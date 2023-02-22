import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-algebra',
  templateUrl: './pie-chart-algebra.component.html'
})
export class PieChartAlgebraComponent implements OnInit {

  constructor(private pagesService: PagesService) { }
  
  data: any;
  distributionByPerformance: Ranking[];
  
  ngOnInit() {
    this.pagesService.getAlgebraPerformanceDistribution('2023-01-01', '2023-02-20').subscribe(distributionByPerformance => {
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
