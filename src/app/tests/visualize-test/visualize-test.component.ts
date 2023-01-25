import { Component, OnInit } from '@angular/core';
import { Test } from '../models/test-model';
import { TestService } from '../services/test.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../models/problem-model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-visualize-test',
  templateUrl: './visualize-test.component.html'
})
export class VisualizeTestComponent implements OnInit {

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
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
        this.test = test;
        this.problemsId = this.test.problems;
        this.testService.getProblemsByIds(this.problemsId).subscribe(problems => this.problems = problems)
      });
  };
}
