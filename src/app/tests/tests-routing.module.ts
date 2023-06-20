import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTestComponent } from './edit-test/edit-test.component';
import { HomeComponent } from './home/home.component';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { NewTestComponent } from './new-test/new-test.component';
import { EditProblemComponent } from './edit-problem/edit-problem.component';
import { NewProblemComponent } from './new-problem/new-problem.component';
import { VisualizeTestComponent } from './visualize-test/visualize-test.component';
import { TestsGuard } from './guards/tests.guard';

const rutas: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'lista', component: ListTestsComponent },
      { path: 'agregar', component: NewTestComponent },
      { path: 'ver/:test_id', component: VisualizeTestComponent },
      { path: 'editar/:id', component: EditTestComponent },
      { path: 'agregar-problema/:id', component: NewProblemComponent, canDeactivate: [ TestsGuard ] },
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
