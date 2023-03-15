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
               private messageService: MessageService*/,
               private location: Location ) { }
  
  @ViewChild('updateProblemForm', { static: true }) updateProblemForm !: NgForm;
  problem: Problem;
  routine: string;
  optionsTypes:string[] = [];
  uploadings: boolean[] = [];
  
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
    GlobalConstants.generateRandomSuffix();
    this.activatedRoute.params.pipe(
      switchMap( ({ id }) => this.testService.getProblemById(id))
    ).subscribe( problem => {
      this.problem = problem;
      this.problem.figures.length ? this.routine = 'con-figura' : this.routine = 'sin-figura';
      this.problem.options.sort((a,b) => (a.letter > b.letter) ? 1 : ((b.letter > a.letter) ? -1 : 0));
      for(let i=0; i<this.problem.options.length; i++) {
        this.problem.options[i].answer.includes('http')? this.optionsTypes[i] = 'figura': this.optionsTypes[i] = 'rutina';  
      }
    });
  }

  onSubmit(): void{
  }

  addFigure() {
    this.problem.figures.push(new Figure('', '' , this.problem.figures.length + 1, '', 'intermedia'));
  }

  addOptionFigure(newOption: Option) {
    GlobalConstants.generateRandomSuffix();
    for(let i=0; i < this.problem.options.length; i++) {
      if(this.problem.options[i].letter === newOption.letter) {
        if(this.problem.options[i].ik_id) {
          this.testService.deleteFigure(this.problem.options[i].ik_id);
        }
        this.problem.options[i] = newOption;
        this.uploadings[i] = false;
      }
    }
  }

  generateRandomOptionFigureName(letter: string) {
    return `${ letter }-${ GlobalConstants.getRandomSuffix() }`
  }

  updateProblem() {
    var options_answers = [];
    var options: Option[] = [];
    if(this.updateProblemForm?.value.optionA === 'rutina') {
      this.problem.options[0].answer = this.updateProblemForm?.value.rutinaA
    }

    if(this.updateProblemForm?.value.optionB === 'rutina') {
      this.problem.options[1].answer = this.updateProblemForm?.value.rutinaB
    }

    if(this.updateProblemForm?.value.optionC === 'rutina') {
      this.problem.options[2].answer = this.updateProblemForm?.value.rutinaC
    }
    
    if(this.updateProblemForm?.value.optionD === 'rutina') {
      this.problem.options[3].answer = this.updateProblemForm?.value.rutinaD
    }

    if(this.updateProblemForm?.value.optionE === 'rutina') {
      this.problem.options[4].answer = this.updateProblemForm?.value.rutinaE
    }

    this.testService.updateProblem(this.problem);
    // console.log(this.activatedRoute.params);
    this.location.back()
    // this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema editado'});
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
