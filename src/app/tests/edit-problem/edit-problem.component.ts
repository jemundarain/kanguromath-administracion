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
  ) {}
  
  @ViewChild('updateProblemForm', { static: true }) updateProblemForm !: NgForm;
  test: Test;
  problem: Problem;
  routine: string;
  items: MenuItem[];
  num_s: number;
  max: number;
  figuresMap1 = GlobalConstants.FIGURES_MAP1;
  figuresMap2 = GlobalConstants.FIGURES_MAP2;

  ngOnInit(): void {
    GlobalConstants.generateRandomSuffix();
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => {
        return this.testService.getProblemById(id);
      })
    ).subscribe( problem => {
      this.problem = problem;
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
    this.problem.figures.push(new Figure('', '' , this.problem.figures.length + 1, '', 'intermedia'));
  }

  getUrlOption(letter: string) {
    for(let i=0; i < this.problem.options.length; i++) {
      if(this.problem.options[i].letter == letter)
        return this.problem.options[i].answer;
    }
    return letter;
  }

  updateProblem() {
    this.confirmationService.confirm({
      header: "Confirmación",
      message: '¿Estás seguro de que deseas editar este problema?',
      accept: () => {
        const thereFigures = !!this.problem.figures.length;
        const thereImagesInOptions = GlobalConstants.hasAtLeastOneOptionWithImageLink(this.problem.options);

        if (thereFigures || thereImagesInOptions) {
          this.testService.createFolder(this.problem._id, "preliminar");
        }

        if (thereFigures) {
          this.problem.figures.forEach((figure) => {
            if (!figure.url.includes("preliminar")) {
              this.testService.moveFile(figure.url.split('/').slice(-1)[0], `preliminar/${this.problem._id}`).subscribe({
                next: () => {},
                error: (err) => { console.log(err); }
              });
              figure.url = GlobalConstants.concatenatePath(figure.url, `/preliminar/${this.problem._id}/`);
            }
          });
        }

        if (thereImagesInOptions) {
          this.problem.options.forEach((option) => {
            if (GlobalConstants.isLink(option.answer) && !option.answer.includes("preliminar")) {
              this.testService.moveFile(option.answer.split('/').slice(-1)[0], `preliminar/${this.problem._id}`).subscribe({
                next: () => {},
                error: (err) => { console.log(err); }
              });
              option.answer = GlobalConstants.concatenatePath(option.answer, `/preliminar/${this.problem._id}/`);
            }
          });
        }
        this.testService.updateProblem(this.test.test_id, this.num_s-1, this.problem);
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema editado 📝'});
        setTimeout(() => {
          this.location.back()
        }, 1220);
      }
    });
  }

  exitConfirmation(): Observable<boolean> {
    return new Observable((observer) => {
      this.confirmationService.confirm({
        header: "Confirmación",
        message: '¿Está seguro que desea salir sin guardar los cambios?',
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }  

  back() {
    this.location.back()
  }
}
