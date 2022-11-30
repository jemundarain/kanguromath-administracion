import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ComponentsModule } from "../components/components.module";
@NgModule({
    declarations: [
        DashboardComponent,
        SettingsComponent,
        LoginComponent
    ],
    exports: [
        DashboardComponent,
        SettingsComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        ComponentsModule
    ]
})
export class PagesModule { }
