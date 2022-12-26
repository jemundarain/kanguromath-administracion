import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTestComponent } from './edit-test/edit-test.component';
import { HomeComponent } from './home/home.component';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { NewTestComponent } from './new-test/new-test.component';
import { EditProblemComponent } from './edit-problem/edit-problem.component';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'lista', component: ListTestsComponent },
      { path: 'agregar', component: NewTestComponent },
      { path: 'editar/:id', component: EditTestComponent },
      { path: 'editar-problema/:id', component: EditProblemComponent },
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
export class TestsRoutingModule { }
