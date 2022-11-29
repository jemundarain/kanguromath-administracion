import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ListTestsComponent } from './pages/tests/list-tests/list-tests.component';
import { NewTestComponent } from './pages/tests/new-test/new-test.component';
import { EditTestComponent } from './pages/tests/edit-test/edit-test.component';
import { EditProblemComponent } from './pages/tests/edit-problem/edit-problem.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'pruebas',
    component: ListTestsComponent
  },
  {
    path: 'pruebas/nueva-prueba',
    component: NewTestComponent
  },
  {
    path: 'pruebas/editar-prueba/:id',
    component: EditTestComponent
  },
  {
    path: 'pruebas/editar-problema/:id',
    component: EditProblemComponent
  },
  {
    path: 'ajustes',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
