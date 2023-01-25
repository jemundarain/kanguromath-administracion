import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { LevelOption } from '../interfaces/level-option.interface';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Problem } from '../models/problem-model';
import { GlobalConstants } from 'src/app/common/global-constants';


@Component({
  selector: 'app-edit-problem',
  templateUrl: './edit-problem.component.html',
  styles: [
    `
      .p-field-radiobutton {
        display: flex;
      }

      label[for="figurasDetectadas"] {
        margin-left: 8px !important;
      }

      ng-katex-html {
        padding: 0.75rem 0.75rem;
      }

    `
  ]
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

  optionB: string = "rutina";
  optionC: string = "rutina";
  optionD: string = "rutina";
  optionE: string = "rutina";


  optionsValues:string[] = [];
  
  figuresMap1 = {
    '=0': '',
    '=1': 'Se detectó ',
    'other': 'Se detectaron '
  }

  figuresMap2 = {
    '=0': 'No se detectaron figuras',
    '=1': 'figura',
    'other': 'figuras'
  }

  getUrlOption(letter: string) {
    for(let i=0; i < this.problem.options.length; i++) {
      if(this.problem.options[i].letter == letter)
        return this.problem.options[i].answer;
    }
    return letter;
  }

  ngOnInit(): void {
    this.levels = GlobalConstants.LEVELS;

    this.testService.getEditions()
      .subscribe( editions => this.editions = editions);

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getProblemById(id))
      )
      .subscribe( problem => {
        this.problem = problem;
        if(this.problem.figures.length) {
          this.rutina = 'con-figura'
        } else {
          this.rutina = 'sin-figura'
        }
        /*this.rutina = this.problem.type;
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
        }*/
        this.cuerpoProblema = this.problem.statement;
        this.problem.options.sort((a,b) => (a.letter > b.letter) ? 1 : ((b.letter > a.letter) ? -1 : 0));
        for(let i=0; i<this.problem.options.length; i++) {
          this.problem.options[i].answer.includes('http')? this.optionsValues[i] = 'figura': this.optionsValues[i] = 'rutina';  
        }
      });

  }

  onSubmit(){
  }
  onBasicUpload(){

  }
}
