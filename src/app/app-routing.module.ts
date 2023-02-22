import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

import { ErrorPageComponent } from './shared/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'acm',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesModule ),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ]
  },
  {
    path: 'pruebas',
    loadChildren: () => import('./tests/tests.module').then( m => m.TestsModule ),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ]
  },
  {
    path: '404',
    component: ErrorPageComponent
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
