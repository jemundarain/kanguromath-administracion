import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LevelOption } from '../interfaces/level-option.interface';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Problem } from '../models/problem-model';
import { Option } from '../models/option-model';
import { Figure } from '../models/figure-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common'


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

  constructor( private testService: TestService, 
               private activatedRoute: ActivatedRoute, 
               private router: Router/*, 
               private messageService: MessageService*/,private location: Location ) { }
  
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
      //console.log(data);
    })
  }

  onSubmit(): void{
  }

  addFigure() {
    let num_s = this.problem.figures.length;
    const newFigure = new Figure('', num_s + 1 , '', 'intermedia');
    this.problem.figures.push(newFigure);
  }

  updateProblem() {
    var options_answers = [];
    var options: Option[] = [];
    if(this.problemForm?.value.optionA == 'rutina') {
      options_answers.push(this.problemForm?.value.rutinaA);
    } else {

    }
    if(this.problemForm?.value.optionB == 'rutina') {
      options_answers.push(this.problemForm?.value.rutinaB);
    } else {

    }
    if(this.problemForm?.value.optionC == 'rutina') {
      options_answers.push(this.problemForm?.value.rutinaC);
    } else {

    }
    if(this.problemForm?.value.optionD == 'rutina') {
      options_answers.push(this.problemForm?.value.rutinaD);
    } else {

    }
    if(this.problemForm?.value.optionE == 'rutina') {
      options_answers.push(this.problemForm?.value.rutinaE);
    } else {

    }
    for(let i=0; i<this.problem.options.length; i++) {
      options.push(new Option(this.problem.options[i]._id, this.problem.options[i].letter, options_answers[i]));
    }
    /*const figures = new Figure();
    const problem = new Problem(this.problem._id, this.problem.problem_id, this.problem.num_s, this.problemForm?.form.value.statement, this.problemForm?.form.value.solution, this.problemForm?.value.category, options, []);
    this.testService.updateProblem(problem);
    this.router.navigateByUrl(`pruebas/ver/${this.test}`);
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema editado'});*/
  }

  back() {
    this.location.back()
  }

  uploadOption(event: any) {
    
    console.log(event);
  }

  // deleteFigure() {
  //   this.problem.figures.pop();
  // }

}
