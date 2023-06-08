import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { Test } from '../models/test-model';
import { TestService } from '../services/test.service';
import { Problem } from '../models/problem-model';

@Component({
  selector: 'app-visualize-test',
  templateUrl: './visualize-test.component.html'
})
export class VisualizeTestComponent implements OnInit {
  test: Test;
  problems: Problem[] = [];
  items: MenuItem[];
  error = false;
  testEmpty = false;

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.pipe(
      switchMap(({ test_id }) => this.testService.getTestById(test_id))
    ).subscribe({
      next: (test) => {
        this.test = test;
        this.testService.getProblemsByTestId(this.test.test_id).subscribe({
          next: (problems) => {
            problems? this.problems = problems : this.testEmpty = true;
          },
          error: () => {
            this.error = true;
          }
        });
        this.items = [
          { label: 'Pruebas' },
          { label: `Preliminar ${this.test?.edition} ${this.test.levels}` }
        ];
      },
      error: () => {
        this.error = true;
      }
    });
  }

  back() {
    this.router.navigateByUrl('pruebas/lista');
  }

  addProblem(test: Test) {
    this.router.navigateByUrl(`pruebas/agregar-problema/${test}`);
  }
}
