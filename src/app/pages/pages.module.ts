import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { ComponentsModule } from "../components/components.module";
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

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
