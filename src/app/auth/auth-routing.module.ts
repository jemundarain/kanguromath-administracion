import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'iniciar-sesion',
        component: LoginComponent
      },
      {
        path: 'recuperar-contrasena',
        component: RecoverPasswordComponent
      },
      {
        path: 'reset-contrasena',
        component: ResetPasswordComponent
      },
      {
        path: '**',
        redirectTo: 'iniciar-sesion'
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
