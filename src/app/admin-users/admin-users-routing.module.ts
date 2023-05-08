import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAdminUserComponent } from './edit-admin-user/edit-admin-user.component';
import { HomeComponent } from './home/home.component';
import { ListAdminUsersComponent } from './list-admin-users/list-admin-users.component';
import { NewAdminUserComponent } from './new-admin-user/new-admin-user.component';
import { VisualizeAdminUserComponent } from './visualize-admin-user/visualize-admin-user.component';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'lista', component: ListAdminUsersComponent },
      { path: 'agregar', component: NewAdminUserComponent },
      { path: 'ver/:username', component: VisualizeAdminUserComponent },
      { path: 'editar/:id', component: EditAdminUserComponent },
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
