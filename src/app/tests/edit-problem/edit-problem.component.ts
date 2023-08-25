import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../services/test.service';
import { Location } from '@angular/common'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable, of, switchMap } from 'rxjs';

import { Test } from '../models/test-model';
import { Problem } from '../models/problem-model';
import { Figure } from '../models/figure-model';
import { Option } from 'src/app/shared/option-model';
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
  ],
  providers: [ConfirmationService, MessageService]
})
export class EditProblemComponent implements OnInit {

  constructor(
    private testService: TestService, 
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location
  ) { }
  
  @ViewChild('updateProblemForm', { static: true }) updateProblemForm !: NgForm;
  test: Test;
  problem: Problem;
  routine: string;
  items: MenuItem[];
  num_s: number;
  max: number;
  figuresMap1 = GlobalConstants.FIGURES_MAP1;
  figuresMap2 = GlobalConstants.FIGURES_MAP2;
  auxFigure: Figure[];
  auxOptions: Option[];

  ngOnInit(): void {
    GlobalConstants.generateRandomSuffix();
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => {
        return this.testService.getProblemById(id);
      })
    ).subscribe( problem => {
      var errStatement = '';
      if(!GlobalConstants.isRenderizableWithKaTeX(problem.statement).res) {
        var errOperator = GlobalConstants.isRenderizableWithKaTeX(problem.statement).operator || '';
        var regex = new RegExp(errOperator, 'g');
        errOperator? errStatement = problem.statement.replace(regex, ''): '';
      }
      this.problem = problem;
      if(errStatement) {
        this.problem.statement = errStatement;
      }
      for(let i=0; i<problem.options.length; i++) {
        if(!GlobalConstants.isRenderizableWithKaTeX(problem.options[i].answer).res) {
          var errOperator = GlobalConstants.isRenderizableWithKaTeX(problem.options[i].answer).operator || '';
          var regex = new RegExp(errOperator, 'g');
          errOperator? problem.options[i].answer = problem.options[i].answer.replace(regex, ''): '';
        }
      }
      this.auxFigure = this.problem.figures;
      this.auxOptions = this.problem.options;
      this.testService.getTestByProblemId(problem._id).subscribe( test => {
        this.test = test[0];
        this.max = this.test.problems.length;
        this.num_s = this.test.problems.indexOf(problem._id) + 1;
        this.items = [
          {label: 'Pruebas'},
          {label: `Preliminar ${this.test?.edition} ${this.test.levels}`},
          {label: `Problema #${this.test.problems.indexOf(problem._id) + 1}`}
        ];
      })
      this.problem.figures.length ? this.routine = 'con-figura' : this.routine = 'sin-figura';
      this.problem.options.sort((a,b) => (a.letter > b.letter) ? 1 : ((b.letter > a.letter) ? -1 : 0));
    });
  }

  addFigure() {
    if(this.problem.figures.length === 0){
      this.problem.figures.push(new Figure('', '' , this.problem.figures.length + 1, '', 'derecha'));
    } else {
      this.problem.figures.push(new Figure('', '' , this.problem.figures.length + 1, '', 'intermedia'));
    }
  }

  getUrlOption(letter: string) {
    const option = this.problem.options.find(opt => opt.letter === letter);
    return option ? option.answer : letter;
  }

  validateUpdateProblemForm() {
    return !this.problem.statement.length || this.problem.options.some(item => item.answer === '') || !this.problem.category.length || !this.problem.solution.length;
  }

  updateProblem() {
    const thereFigures = !!this.problem.figures.length;
    const thereImagesInOptions = GlobalConstants.hasAtLeastOneOptionWithImageLink(this.problem.options);

    if (thereFigures || thereImagesInOptions) {
      this.testService.createFolder(this.problem._id, "preliminar");
    }

    if (thereFigures) {
      this.problem.figures.forEach((figure) => {
        if (!figure.url.includes("preliminar")) {
          this.testService.moveFile(figure.url.split('/').slice(-1)[0], `preliminar/${this.problem._id}`).subscribe();
          figure.url = GlobalConstants.concatenatePath(figure.url, `/preliminar/${this.problem._id}/`);
        }
      });
    }

    if (thereImagesInOptions) {
      this.problem.options.forEach((option) => {
        if (GlobalConstants.isLink(option.answer) && !option.answer.includes("preliminar")) {
          this.testService.moveFile(option.answer.split('/').slice(-1)[0], `preliminar/${this.problem._id}`).subscribe();
          option.answer = GlobalConstants.concatenatePath(option.answer, `/preliminar/${this.problem._id}/`);
        }
      });
    }
    this.testService.updateProblem(this.test._id, this.num_s-1, this.problem).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema editado 📝'});
        setTimeout(() => {
          this.location.back()
        }, 1220);
      },
      error: (err) => {
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'El problema no fue editado 🙁'});
      }
    });
    
  }

  exitConfirmation(): Observable<boolean> {
    return new Observable((observer) => {
      this.testService.getListFiles('preliminar/'+this.problem._id).subscribe({
        next: (res) => {
          for(const image of res) {
            if(!isNaN(Number(image.name.split('-')[0]))) {
              if(this.auxFigure[Number(image.name.split('-')[0])-1] !== image.url) {
                this.testService.deleteImage(this.problem.figures[Number(image.name.split('-')[0])-1].ik_id).subscribe();
              }
            } else {
              switch (image.name.split('-')[0]) {
                case 'A':
                  if(this.auxOptions[0].answer !== image.url) {
                    this.testService.deleteImage(this.problem.options[0].ik_id).subscribe();
                  }
                break;
                case 'B':
                  if(this.auxOptions[1].answer !== image.url) {
                    this.testService.deleteImage(this.problem.options[1].ik_id).subscribe();
                  }
                break;
                case 'C':
                  if(this.auxOptions[2].answer !== image.url) {
                    this.testService.deleteImage(this.problem.options[2].ik_id).subscribe();
                  }
                break;
                case 'D':
                  if(this.auxOptions[3].answer !== image.url) {
                    this.testService.deleteImage(this.problem.options[3].ik_id).subscribe();
                  }
                break;
                case 'E':
                  if(this.auxOptions[4].answer !== image.url) {
                    this.testService.deleteImage(this.problem.options[4].ik_id).subscribe();
                  }
                break;
              
                default:
                  break;
              }
            }
          }
          observer.next(true);
          observer.complete();
        },
        error: (err) => {
        }
      });
    });
  }  

  back() {
    this.location.back()
  }
}
