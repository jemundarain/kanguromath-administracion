import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../models/problem-model';
import { switchMap } from 'rxjs';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-problem-component',
  templateUrl: './new-problem.component.html'
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
  routine: string;
  optionsTypes:string[] = [];
  uploadings: boolean[] = [];

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
  }

}
