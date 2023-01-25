import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { NgForm } from '@angular/forms';

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
    private router: Router
  ) { }

  @ViewChild('editionsForm', { static: true }) editionsForm!: NgForm;
  editions: string[];
  edition: string;
  tests: Test[] = [];

  ngOnInit(): void {
    this.testService.getEditions()
      .subscribe( editions => {this.editions = editions});

    this.editionsForm?.form.valueChanges.subscribe((data) => {
      this.testService.getTestsByEdition(data.edition)
        .subscribe( tests => this.tests = tests);
    })
  }

  ngOnDestroy(): void {
    
  }


  deleteTest(test_id: string){
    this.testService.deleteTest(test_id);
  }
}
