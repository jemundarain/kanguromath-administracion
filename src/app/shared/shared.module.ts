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
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    SlideMenuComponent, 
    PieChartForRolComponent, 
    RankingListComponent,
    PieChartForLevelComponent,
    StateTitlePipe,
    ProgressSpinnerComponent,
    NavbarComponent,
    HeaderComponent,
    UploadFileComponent
  ],
  exports: [
    SlideMenuComponent,
    PieChartForRolComponent,
    RankingListComponent,
    PieChartForLevelComponent,
    ProgressSpinnerComponent,
    NavbarComponent,
    HeaderComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ImagekitioAngularModule.forRoot({
      publicKey: environment.publicKey,
      urlEndpoint: environment.urlEndpoint,
      authenticationEndpoint: environment.authenticationEndpoint
    })
  ]
})
export class SharedModule { }
