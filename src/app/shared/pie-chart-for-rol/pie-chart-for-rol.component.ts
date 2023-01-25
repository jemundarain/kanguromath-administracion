import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';
import { PagesService } from '../../pages/services/pages.service';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-pie-chart-for-rol',
  templateUrl: './pie-chart-for-rol.component.html'
})
export class PieChartForRolComponent implements OnInit {
  constructor(private pagesService: PagesService) { }
  
    distributionByType: Ranking[];
    public chart: any;

  ngOnInit(): void {
    this.pagesService.getUsersDistributionByType().subscribe(distributionByType => {
      this.distributionByType = distributionByType;
      Chart.defaults.font.size = 16;
      Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
      this.chart = new Chart("pie-chart-forRol",  {
          type: 'pie',
          data: {
            labels: GlobalConstants.getLabelsDistribution(this.distributionByType),
            datasets: [{
              label: "Usuarios",
              backgroundColor: GlobalConstants.getDesorderArray(GlobalConstants.TYPES_COLORS).slice(0, GlobalConstants.getLabelsDistribution(this.distributionByType).length),
              data: GlobalConstants.convertDistributionToArray(this.distributionByType)
            }]
          }
      });
    })
  }

}
