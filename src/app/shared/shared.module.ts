import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { SlideMenuComponent } from './slide-menu/slide-menu.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { PieChartForRolComponent } from './pie-chart-for-rol/pie-chart-for-rol.component';
import { PieChartForLevelComponent } from './pie-chart-for-level/pie-chart-for-level.component';
import { StateTitlePipe } from './pipes/state-title.pipe';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    SlideMenuComponent, 
    PieChartForRolComponent, 
    RankingListComponent,
    PieChartForLevelComponent,
    StateTitlePipe,
    ProgressSpinnerComponent,
    NavbarComponent,
    HeaderComponent
  ],
  exports: [
    SlideMenuComponent,
    PieChartForRolComponent,
    RankingListComponent,
    PieChartForLevelComponent,
    ProgressSpinnerComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ]
})
export class SharedModule { }
