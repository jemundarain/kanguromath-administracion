import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../models/problem-model';
import { Subject, switchMap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-problem-component',
  templateUrl: './new-problem.component.html',
  providers: [ConfirmationService, MessageService]
})
export class NewProblemComponent implements OnInit {

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  @ViewChild('addNewProblemForm', { static: true }) addNewProblemForm !: NgForm;
  @ViewChild('addExistingProblemForm', { static: true }) addExistingProblemForm !: NgForm;
  items: MenuItem[];
  test: Test;
  options: string[];
  option: string = GlobalConstants.NEW_PROBLEM_OPTIONS[0];
  problem: Problem;
  problemSelected: Problem;
  suggestedProblems: Problem[];
  error: boolean;
  term: string;
  // routine: string;
  // optionsTypes:string[] = [];
  // uploadings: boolean[] = [];

  ngOnInit(): void {
    this.options = GlobalConstants.NEW_PROBLEM_OPTIONS;
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => {
        this.test = test;
        this.items = [
          {label: 'Pruebas'},
          {label: `Preliminar ${this.test.edition} ${this.test.levels}`},
          {label: 'Problemas'},
          {label: 'Problema nuevo'}
        ];
      });
      
      // this.addExistingProblemForm.form.valueChanges.subscribe(({search}) => {
      //   this.testService.searchProblem(search);
      // })

  }
  
  suggestions( term: string ) { 
    this.term = term;   
    if(term !== '') {
      this.activatedRoute.params.subscribe(params => {
        this.testService.searchProblem( params['id']?.split('-')[1], term ).subscribe({
          next: (problems) => this.suggestedProblems = Array.from(new Set([].concat(...problems))),
          error: (err) => this.error = true
        })       
      });
    } else {
      this.suggestedProblems = [];
    }
  }

  seeProblem(problem: Problem) {
    console.log(problem)
    this.problemSelected = {...problem};
    this.suggestedProblems = [];
  }

  addProblem() {
    this.testService.addExistingProblem(this.test.test_id, this.problemSelected.problem_id);
  }

}
