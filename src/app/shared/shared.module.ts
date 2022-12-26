import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { SlideMenuComponent } from './slide-menu/slide-menu.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';

@NgModule({
  declarations: [
    SlideMenuComponent, 
    LineChartComponent, 
    PieChartComponent, 
    RankingListComponent
  ],
  exports: [
    SlideMenuComponent,
    LineChartComponent,
    PieChartComponent,
    RankingListComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ]
})
export class SharedModule { }
