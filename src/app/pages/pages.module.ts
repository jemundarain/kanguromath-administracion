import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorPageComponent } from '../shared/error-page/error-page.component';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    declarations: [
        DashboardComponent,
        SettingsComponent,
        ErrorPageComponent,
        HomeComponent
    ],
    exports: [
        DashboardComponent,
        SettingsComponent,
        ErrorPageComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        SharedModule,
        PagesRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        ConfirmDialogModule
    ],
    providers: [
        ConfirmationService
      ]
})
export class PagesModule { }
