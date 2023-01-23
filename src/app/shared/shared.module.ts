import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { SlideMenuComponent } from './slide-menu/slide-menu.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { PieChartForRolComponent } from './pie-chart-for-rol/pie-chart-for-rol.component';
import { PieChartForLevelComponent } from './pie-chart-for-level/pie-chart-for-level.component';
import { StateTitlePipe } from './pipes/state-title.pipe';

@NgModule({
  declarations: [
    SlideMenuComponent, 
    LineChartComponent, 
    PieChartForRolComponent, 
    RankingListComponent,
    PieChartForLevelComponent,
    StateTitlePipe
  ],
  exports: [
    SlideMenuComponent,
    LineChartComponent,
    PieChartForRolComponent,
    RankingListComponent,
    PieChartForLevelComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ]
})
export class SharedModule { }
