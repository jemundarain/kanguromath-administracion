import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TestService } from '../services/test.service';
import { Test } from '../test-model';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html'
})
export class ListTestsComponent implements OnInit, OnDestroy {

  constructor(
    private activateRoute: ActivatedRoute,
    private testService: TestService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  form: FormGroup = new FormGroup({});
  
  tests: Test[] = [];
  testsSub = new Subscription();

  editions: string[];
  editionSub = new Subscription();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      edition: [null, Validators.nullValidator]
    });

    this.testsSub = this.testService.testsSubject.subscribe(tests => {
      this.tests = tests;
    });

    this.testService.getEditions();
    this.editionSub = this.testService.editionSubject.subscribe(editions => {
      this.editions = editions;
      this.form.valueChanges.subscribe((data) => {
        this.testService.getTestsByEdition(data['edition']);
      })
    });
  }

  ngOnDestroy(): void {
    this.testsSub.unsubscribe();
  }

  onEdit(id: string){
    this.router.navigate(['pruebas/editar/',id])
  }

  /*onDelete(id: string){
    this.testService.onDeleteTest(id);
  }

  onEdit(id: string){
    this.router.navigate(['/pruebas/editar', id])
  }*/

}
