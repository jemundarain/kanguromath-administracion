import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { NewTestComponent } from './new-test/new-test.component';
import { EditTestComponent } from './edit-test/edit-test.component';
import { EditProblemComponent } from './edit-problem/edit-problem.component';



@NgModule({
  declarations: [
    ListTestsComponent,
    NewTestComponent,
    EditTestComponent,
    EditProblemComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TestsModule { }
