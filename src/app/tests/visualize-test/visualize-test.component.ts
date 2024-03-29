import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';

import { Test } from '../models/test-model';
import { TestService } from '../services/test.service';
import { Problem } from '../models/problem-model';
import { PageService } from 'src/app/pages/services/page.service';

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
  app_enabled: boolean;
  
  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private pageService: PageService,
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
            problems.length? this.problems = problems : this.testEmpty = true;
          },
          error: () => {
            this.error = true;
          }
        });
        this.items = [
          { label: 'Pruebas' },
          { label: `Preliminar ${this.test?.edition} ${this.test.levels}` }
        ];
        this.pageService.getAppState().subscribe(
          global => this.app_enabled = global.app_enabled
        );
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

  showError( error: string) {
    this.messageService.add({ severity:'error', summary: 'Error', detail: `${error}`, life: 3250 });
  }
}
