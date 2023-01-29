import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      children: [
        { path: 'informe', component: DashboardComponent },
        { path: 'ajustes', component: SettingsComponent },
        { path: 'perfil', component: ProfileComponent },
        { path: '**', redirectTo: 'informe' }
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
