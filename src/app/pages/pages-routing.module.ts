import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformeGeneralComponent } from './informe-general/informe-general.component';
import { InformeDesempenoComponent } from './informe-desempeno/informe-desempeno.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      children: [
        { path: 'informe-general', component: InformeGeneralComponent },
        { path: 'informe-desempeno', component: InformeDesempenoComponent },
        { path: 'ajustes', component: SettingsComponent },
        { path: 'perfil', component: ProfileComponent },
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
