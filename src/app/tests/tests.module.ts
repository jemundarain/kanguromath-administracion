import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { NewTestComponent } from './new-test/new-test.component';
import { EditTestComponent } from './edit-test/edit-test.component';
import { EditProblemComponent } from './edit-problem/edit-problem.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HomeComponent } from './home/home.component';
import { TestsRoutingModule } from './tests-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VisualizeTestComponent } from './visualize-test/visualize-test.component';
import { LevelsTittlePipe } from './pipes/levels-tittle.pipe';
import { LevelsHeaderPipe } from './pipes/levels-header.pipe';
import { KatexModule } from 'ng-katex';
import { ProblemComponent } from './problem/problem.component';
import { FiguresTableComponent } from './figures-table/figures-table.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        ListTestsComponent,
        NewTestComponent,
        EditTestComponent,
        EditProblemComponent,
        HomeComponent,
        VisualizeTestComponent,
        LevelsTittlePipe,
        LevelsHeaderPipe,
        ProblemComponent,
        FiguresTableComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule,
        TestsRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        KatexModule,
        SharedModule
    ]
})
export class TestsModule { }
