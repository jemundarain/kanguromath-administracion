import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TestService } from '../services/test.service';
import { Test } from '../test-model';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html'
})
export class ListTestsComponent implements OnInit, OnDestroy {

  constructor( private testService: TestService, private router: Router) { }
  
  tests: Test[] = [];
  testSub = new Subscription();

  editions: string[];
  editionSub = new Subscription();
  selectedEdition: string;

  ngOnInit(): void {
    this.testService.getTests();
    this.testSub = this.testService.testSubject.subscribe(tests => {
      this.tests = tests;
    });

    this.testService.getEditions();
    this.editionSub = this.testService.editionSubject.subscribe(editions => {
      this.editions = editions;
    });
  }

  ngOnDestroy(): void {
    this.testSub.unsubscribe();
  }

  /*onDelete(id: string){
    this.testService.onDeleteTest(id);
  }*/

  onEdit(id: string){
    this.router.navigate(['/pruebas/editar', id])
  }

}
