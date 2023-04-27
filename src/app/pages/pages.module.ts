import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeGeneralComponent } from './informe-general/informe-general.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorPageComponent } from '../shared/error-page/error-page.component';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { ListUsersComponent } from './list-users/list-users.component';

@NgModule({
    declarations: [
        InformeGeneralComponent,
        SettingsComponent,
        ErrorPageComponent,
        HomeComponent,
        ProfileComponent,
        PerformanceReportComponent,
        ListUsersComponent
    ],
    exports: [
        InformeGeneralComponent,
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
