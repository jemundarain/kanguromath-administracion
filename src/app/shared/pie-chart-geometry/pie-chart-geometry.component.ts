import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-geometry',
  templateUrl: './pie-chart-geometry.component.html'
})
export class PieChartGeometryComponent implements OnChanges {

  data: any;
  distributionByPerformance: Ranking[];
  @Input() dateStart: string;
  @Input() dateEnd: string;
  @Output() onLoadComplete: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private pagesService: PagesService
  ) {}

  ngOnChanges() {
    if(this.dateStart && this.dateEnd) {
      this.pagesService.getGeometryPerformanceDistribution(this.dateStart, this.dateEnd).subscribe(distributionByPerformance => {
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
