import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html'
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
      this.tests = [];
      this.testService.getTestsByEdition(data.edition)
      .subscribe( tests => this.tests = tests);
    })
  }
  
  ngOnDestroy(): void {
  }

  deleteTest(_id: string){
    this.testService.deleteTest(_id);
  }
}
