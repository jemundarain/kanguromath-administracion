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
import { PieChartForInstitutionComponent } from './pie-chart-for-institution/pie-chart-for-institution.component';
import { PieChartForSexComponent } from './pie-chart-for-sex/pie-chart-for-sex.component';
import { PieChartAlgebraComponent } from './pie-chart-algebra/pie-chart-algebra.component';
import { PieChartGeometryComponent } from './pie-chart-geometry/pie-chart-geometry.component';
import { PieChartCombinatoricsComponent } from './pie-chart-combinatorics/pie-chart-combinatorics.component';
import { PieChartNumberTheoryComponent } from './pie-chart-number-theory/pie-chart-number-theory.component';


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
    UploadFileComponent,
    PieChartForInstitutionComponent,
    PieChartForSexComponent,
    PieChartAlgebraComponent,
    PieChartGeometryComponent,
    PieChartCombinatoricsComponent,
    PieChartNumberTheoryComponent
  ],
  exports: [
    SlideMenuComponent,
    PieChartForRolComponent,
    RankingListComponent,
    PieChartForLevelComponent,
    ProgressSpinnerComponent,
    NavbarComponent,
    HeaderComponent,
    UploadFileComponent,
    PieChartForInstitutionComponent,
    PieChartForSexComponent,
    PieChartAlgebraComponent,
    PieChartGeometryComponent,
    PieChartCombinatoricsComponent,
    PieChartNumberTheoryComponent
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
