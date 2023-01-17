import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { Test } from '../test-model';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html',
  styles: [`
    td:not(:nth-child(1)) {
      width: 120px;
    }

    td {
        text-align: center !important;
    }

    table a:hover .pi:before {
        color: #f59e0b;
    }

    th:nth-child(1) {
        width: 40%;
    }
  `]
  
})
export class ListTestsComponent implements OnInit, OnDestroy {

  constructor(
    private testService: TestService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  form: FormGroup = new FormGroup({});
  editions: string[];
  tests: Test[] = [];

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      edition: [null, Validators.nullValidator]
    });

    this.testService.getEditions()
      .subscribe( editions => {this.editions = editions});

    this.form.valueChanges.subscribe((data) => {
      this.testService.getTestsByEdition(data['edition'])
        .subscribe( tests => this.tests = tests);
    })
  }

  ngOnDestroy(): void {
    
  }

  /*onEdit(id: string){
    this.router.navigate(['pruebas/editar/',id])
  }

  onDelete(id: string){
    this.testService.onDeleteTest(id);
  }

  onEdit(id: string){
    this.router.navigate(['/pruebas/editar', id])
  }*/

}
