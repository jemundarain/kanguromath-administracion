import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListAdminUsersComponent } from './list-admin-users/list-admin-users.component';
import { NewAdminUserComponent } from './new-admin-user/new-admin-user.component';
import { EditAdminUserComponent } from './edit-admin-user/edit-admin-user.component';
import { VisualizeAdminUserComponent } from './visualize-admin-user/visualize-admin-user.component';
import { HomeComponent } from './home/home.component';
import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    ListAdminUsersComponent,
    NewAdminUserComponent,
    EditAdminUserComponent,
    VisualizeAdminUserComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    AdminUsersRoutingModule,
    SharedModule,
    PrimeNgModule
  ]
})
export class AdminUsersModule { }
