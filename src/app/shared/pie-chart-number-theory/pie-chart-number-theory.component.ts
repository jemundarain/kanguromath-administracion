import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PageService } from 'src/app/pages/services/page.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pie-chart-number-theory',
  templateUrl: './pie-chart-number-theory.component.html'
})
export class PieChartNumberTheoryComponent implements OnChanges {
  
  data: any;
  distributionByPerformance: Ranking[];
  plugins = [ChartDataLabels];
  @Input() dateStart: string;
  @Input() dateEnd: string;
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private pageService: PageService
  ) {}

  ngOnChanges() {
    if(this.dateStart && this.dateEnd) {
      this.pageService.getNumberTheoryPerformanceDistribution(this.dateStart, this.dateEnd).subscribe(distributionByPerformance => {
        this.distributionByPerformance = distributionByPerformance;
        this.data = {
          labels: GlobalConstants.getDistributionLabels(this.distributionByPerformance, GlobalConstants.PERFORMANCE_OPTIONS),
          datasets: [{
            data: GlobalConstants.convertDistributionToArray(this.distributionByPerformance),
            backgroundColor: ["#44896A", "#dc2626"]
          }]
        };
        this.onLoadComplete.emit(true);
      })
    }
  }
}
