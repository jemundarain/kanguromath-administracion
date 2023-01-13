import { Component, OnInit } from '@angular/core';
import { Test } from '../test-model';
import { TestService } from '../services/test.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../problem-model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-visualize-test',
  templateUrl: './visualize-test.component.html'
})
export class VisualizeTestComponent implements OnInit {

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute
  ) { }

  test : Test;
  problemsId: string[];
  problems : Problem[] = [];

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => {
        this.test = test[0];
        this.problemsId = this.test.problems;
        for(let i=0; i<this.problemsId.length; i++) {
          this.testService.getProblemById(this.problemsId[i])
          .subscribe( problem => {
            this.problems.push(problem[0]);
          })
        }
        this.problems.sort((a, b) => a.num_s-b.num_s);
      });
  };
}
