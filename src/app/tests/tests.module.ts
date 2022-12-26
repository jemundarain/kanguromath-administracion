import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { NewTestComponent } from './new-test/new-test.component';
import { EditTestComponent } from './edit-test/edit-test.component';
import { EditProblemComponent } from './edit-problem/edit-problem.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HomeComponent } from './home/home.component';
import { TestsRoutingModule } from './tests-routing.module';

@NgModule({
  declarations: [
    ListTestsComponent,
    NewTestComponent,
    EditTestComponent,
    EditProblemComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    TestsRoutingModule
  ]
})
export class TestsModule { }
