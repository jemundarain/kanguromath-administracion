import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralReportComponent } from './general-report/general-report.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorPageComponent } from '../shared/error-page/error-page.component';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PerformanceReportComponent } from './performance-report/performance-report.component';

@NgModule({
    declarations: [
        GeneralReportComponent,
        SettingsComponent,
        ErrorPageComponent,
        HomeComponent,
        PerformanceReportComponent
    ],
    exports: [
        GeneralReportComponent,
        SettingsComponent,
        ErrorPageComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        SharedModule,
        PagesRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ]
})
export class PagesModule { }
