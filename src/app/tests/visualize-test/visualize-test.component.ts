import { Component, OnInit } from '@angular/core';
import { Test } from '../models/test-model';
import { TestService } from '../services/test.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../models/problem-model';
import { switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-visualize-test',
  templateUrl: './visualize-test.component.html'
})
export class VisualizeTestComponent implements OnInit {

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  test : Test;
  problemsId: string[];
  problems : Problem[];
  items: MenuItem[];
  onInitFinish: boolean = false;

  ngOnInit() {
    this.activatedRoute.params
      .pipe(switchMap( ({ test_id }) => this.testService.getTestById(test_id)))
      .subscribe( test => {
        this.test = test;
        this.testService.getProblemsByTestId(this.test.test_id).subscribe(problems => this.problems = problems)
        this.items = [
          {label: 'Pruebas'},
          {label: `Preliminar ${this.test?.edition} ${this.test.levels}`}
        ];
      });
    this.onInitFinish = true;
  };

  back() {
    this.router.navigateByUrl('pruebas/lista');
  }

  addProblem(test: Test) {
    this.router.navigateByUrl(`pruebas/agregar-problema/${test}`);
  }
}
