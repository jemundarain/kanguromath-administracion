import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ListAdminUsersComponent } from './list-admin-users/list-admin-users.component';
import { NewAdminUserComponent } from './new-admin-user/new-admin-user.component';
import { VisualizeAdminUserComponent } from './visualize-admin-user/visualize-admin-user.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'lista', component: ListAdminUsersComponent },
      { path: 'agregar', component: NewAdminUserComponent },
      { path: 'ver/:username', component: VisualizeAdminUserComponent },
      { path: 'editar/:username', component: NewAdminUserComponent },
      { path: '**', redirectTo: 'lista' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild( rutas )
  ],
  exports: [
    RouterModule
  ]
})
export class AdminUsersRoutingModule { }
