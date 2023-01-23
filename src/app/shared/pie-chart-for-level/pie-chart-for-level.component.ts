import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js/auto';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-pie-chart-for-level',
  templateUrl: './pie-chart-for-level.component.html'
})
export class PieChartForLevelComponent implements OnInit {
  constructor(private pagesService: PagesService) { }

  ngOnInit(): void {
    this.createChart();
  }

  public chart: any;
  distributionByLevel: Ranking[];

  createChart(){
    this.pagesService.getUsersDistributionByLevel().subscribe(distributionByLevel => {
      this.distributionByLevel = distributionByLevel;
      this.chart = new Chart("pie-chart-forLevel", {
        type: 'pie',
        data: {
          labels: GlobalConstants.getLabelsDistribution(this.distributionByLevel),
          datasets: [{
            label: "Usuarios",
            backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.LEVELS_COLORS).slice(0, GlobalConstants.getLabelsDistribution(this.distributionByLevel).length),
            data: GlobalConstants.convertDistributionToArray(this.distributionByLevel)
          }]
        }
      });
    })
  }
}     