import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralReportComponent } from './general-report/general-report.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      children: [
        { path: 'informe-general', component: GeneralReportComponent },
        { path: 'informe-desempeno', component: PerformanceReportComponent },
        { path: 'ajustes', component: SettingsComponent },
        { path: '**', redirectTo: 'informe-general' }
      ]
    }
  ];


@NgModule({
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }
