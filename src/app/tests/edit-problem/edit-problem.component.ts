import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { LevelOption } from '../interfaces/level-option.interface';
import { TestService } from '../services/test.service';
import { Test } from '../test-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Problem } from '../problem-model';


@Component({
  selector: 'app-edit-problem',
  templateUrl: './edit-problem.component.html'
})
export class EditProblemComponent implements OnInit {
  formBuilder: any;

  constructor( private testService: TestService, private activatedRoute: ActivatedRoute ) { }
  rutina: string;
  conFigura: string;
  value1: number = 0;
  min: number = 2009;
  property: string = '';
  
  levels: LevelOption[];
  form: FormGroup = new FormGroup({});
  editions: string[];
  tests: Test[] = [];
  test!: Test;

  problem: Problem;
  cuerpoProblema: string;
  resultado: string;

  textoA: string;
  optionA: string;

  ngOnInit(): void {
    this.levels = [
      {name: '1ero', code: '1ero'},
      {name: '1ero y 2do', code: '1ero-2do'},
      {name: '2do', code: '2do'},
      {name: '3ero', code: '3ero'},
      {name: '4to', code: '4to'},
      {name: '4to y 5to', code: '4to-5to'},
      {name: '5to', code: '5to'}
    ]

    this.testService.getEditions()
      .subscribe( editions => this.editions = editions);

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getProblemById(id))
      )
      .subscribe( problem => {
        this.problem = problem[0];
        this.rutina = this.problem.type;
        switch (this.problem.type) {
          case 'sin-figura':
            this.rutina = this.problem.type
            break;    
          case 'figura-derecha':
          case 'figura-intermedia':
            this.rutina = 'con-figura';
            this.conFigura = this.problem.type;
            break;   
          default:
            break;
        }
        this.cuerpoProblema = this.problem.statement;
      });

  }

  onSubmit(){
  }
  onBasicUpload(){

  }
}
