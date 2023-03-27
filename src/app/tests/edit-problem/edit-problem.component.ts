import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Problem } from '../models/problem-model';
import { Figure } from '../models/figure-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
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
  ],
  providers: [ConfirmationService, MessageService]
})
export class EditProblemComponent implements OnInit {

  constructor( private testService: TestService, 
               private activatedRoute: ActivatedRoute,
               private confirmationService: ConfirmationService,
               private router: Router, 
               private messageService: MessageService,
               private location: Location ) { }
  
  @ViewChild('updateProblemForm', { static: true }) updateProblemForm !: NgForm;
  test: Test;
  problem: Problem;
  routine: string;
  items: MenuItem[];
  figuresMap1 = GlobalConstants.FIGURES_MAP1;
  figuresMap2 = GlobalConstants.FIGURES_MAP2;

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
      this.testService.getTestByProblemId(this.problem.problem_id).subscribe( test => {
        this.test = test[0];
        this.items = [
          {label: 'Pruebas'},
          {label: `Preliminar ${this.test?.edition} ${this.test.levels}`},
          {label: `Problema #${this.problem?.num_s}`}
        ];
      })
      this.problem.figures.length ? this.routine = 'con-figura' : this.routine = 'sin-figura';
      this.problem.options.sort((a,b) => (a.letter > b.letter) ? 1 : ((b.letter > a.letter) ? -1 : 0));

    });
  }

  onSubmit(): void{
  }

  addFigure() {
    this.problem.figures.push(new Figure('', '' , this.problem.figures.length + 1, '', 'intermedia'));
  }

  updateProblem() {
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

    this.confirmationService.confirm({
      header: "Confirmación",
      message: '¿Está seguro que desea editar este problema?',
      accept: () => {
        this.testService.updateProblem(this.problem);
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema editado'});
        setTimeout(() => {
          this.location.back()
        }, 1220);
      }
    });
  }

  back() {
    this.location.back()
  }

  uploadOption(event: any) {
    console.log(event);
  }

}
