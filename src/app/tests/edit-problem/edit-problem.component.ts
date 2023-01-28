import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LevelOption } from '../interfaces/level-option.interface';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Problem } from '../models/problem-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Figure } from '../models/figure-model';


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

  constructor( private testService: TestService, private activatedRoute: ActivatedRoute ) { }
  
  @ViewChild('problemForm', { static: true }) problemForm !: NgForm;
  rutina: string;
  conFigura: string;
  value1: number = 0;
  min: number = 2009;
  property: string = '';
  
  levels: LevelOption[];
  editions: string[];
  tests: Test[] = [];
  test!: Test;

  problem: Problem;
  cuerpoProblema: string;
  resultado: string;

  optionsValues:string[] = [];
  category: string;
  solution: string;
  
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

    this.activatedRoute.params.pipe(
      switchMap( ({ id }) => this.testService.getProblemById(id))
    ).subscribe( problem => {
      this.problem = problem;
      this.problem.figures.length ? this.rutina = 'con-figura' : this.rutina = 'sin-figura';
      this.cuerpoProblema = this.problem.statement;
      this.problem.options.sort((a,b) => (a.letter > b.letter) ? 1 : ((b.letter > a.letter) ? -1 : 0));
      for(let i=0; i<this.problem.options.length; i++) {
        this.problem.options[i].answer.includes('http')? this.optionsValues[i] = 'figura': this.optionsValues[i] = 'rutina';  
      }
      this.category = this.problem.category;
      this.solution = this.problem.solution;
    });
    
    this.problemForm?.form.valueChanges.subscribe((data) => {
      if(this.problemForm.controls['numberFigures'].value != this.problem.figures.length) {
        if(this.problemForm.controls['numberFigures'].value > this.problem.figures.length) {
          this.addFigure();
        } /*else {
          console.log('disminuy');  
        }*/
      }
    })
  }

  onSubmit(): void{
  }
  onBasicUpload(){
  }

  addFigure() {
    let num_s = this.problem.figures.length;
    const newFigure = new Figure('', num_s + 1 , '', 'intermedia');
    this.problem.figures.push(newFigure);
  }

  // deleteFigure() {
  //   this.problem.figures.pop();
  // }

}
