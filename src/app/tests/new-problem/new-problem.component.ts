import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common'
import { Observable, of, switchMap } from 'rxjs';

import { GlobalConstants } from 'src/app/common/global-constants';
import { Problem } from '../models/problem-model';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { Option } from '../../shared/option-model';
import { Figure } from '../models/figure-model';

@Component({
  selector: 'app-new-problem-component',
  templateUrl: './new-problem.component.html',
  providers: [ConfirmationService, MessageService]
})
export class NewProblemComponent implements OnInit {

  @ViewChild('addNewProblemForm', { static: true }) addNewProblemForm !: NgForm;
  @ViewChild('addExistingProblemForm', { static: true }) addExistingProblemForm !: NgForm;
  items: MenuItem[];
  test: Test;
  options: string[];
  option: string = GlobalConstants.NEW_PROBLEM_OPTIONS[0];
  newProblem: Problem;
  problemSelected: Problem;
  suggestedProblems: Problem[];
  figuresMap1 = GlobalConstants.FIGURES_MAP1;
  figuresMap2 = GlobalConstants.FIGURES_MAP2;
  num_s: number;
  error: boolean;
  term: string;
  
  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.options = GlobalConstants.NEW_PROBLEM_OPTIONS;
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => {
        this.test = test;
        this.num_s = this.test.problems.length+1;
        this.newProblem = new Problem('', '', '', 'sin-categoria', [ new Option("", "A","", ""), new Option("", "B", "", ""), new Option("", "C","", ""), new Option("", "D", "", ""), new Option("", "E", "", "") ], []);
        this.items = [
          {label: 'Pruebas'},
          {label: `Preliminar ${this.test.edition} ${this.test.levels}`},
          {label: `Problema #${this.num_s}`}
        ];
      });
  }

  addFigure() {
    this.newProblem.figures.push(new Figure('', '' , this.newProblem.figures.length + 1, '', this.newProblem.figures.length === 0? 'derecha':'intermedia'));
  }

  exitConfirmation(): Observable<boolean> {
    if (this.newProblem.statement === '' || this.newProblem.options.every((option) => option.answer === '') || this.newProblem.solution === '') {
      this.newProblem.figures.forEach((figure) => {
        this.testService.deleteFigure(figure.ik_id);
      });
      this.newProblem.options.forEach((option) => {
        this.testService.deleteFigure(option.ik_id);
      });
      return of(true);
    } else {
      return new Observable((observer) => {
        this.confirmationService.confirm({
          header: "Confirmación",
          message: '¿Está seguro que desea salir sin guardar los cambios?',
          accept: () => {
            this.newProblem.figures.forEach((figure) => {
              this.testService.deleteFigure(figure.ik_id);
            });
            this.newProblem.options.forEach((option) => {
              this.testService.deleteFigure(option.ik_id);
            });
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
  }  

  suggestions( term: string ) { 
    this.term = term;   
    if(term !== '') {
      this.activatedRoute.params.subscribe(params => {
        this.testService.searchProblem( params['id']?.split('-')[1], term, this.test.levels ).subscribe({
          next: (problems) => this.suggestedProblems = Array.from(new Set([].concat(...problems))),
          error: (err) => this.error = true
        })       
      });
    } else {
      this.suggestedProblems = [];
    }
  }

  seeProblem(problem: Problem) {
    this.problemSelected = problem;
    this.suggestedProblems = [];
  }

  addProblem() {
    this.testService.addExistingProblem(this.test.test_id, this.problemSelected._id).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema agregado ✅' });
        setTimeout(() => {
          this.location.back()
        }, 1220);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'El problema no fue agregado 🙁', life: 3250 });
      }
    });
  }

  saveNewProblem() {
    this.testService.addNewProblem(this.newProblem, this.test.test_id).subscribe({
      next: (newProblem) => {
        const thereFigures = !!newProblem.figures.length;
        const thereImagesInOptions = GlobalConstants.hasAtLeastOneOptionWithImageLink(newProblem.options);

        if (thereFigures || thereImagesInOptions) {
          this.testService.createFolder(newProblem._id, "preliminar");
        }

        if (thereFigures) {
          newProblem.figures.forEach((figure) => {
            this.testService.moveFile(figure.url.split('/').slice(-1)[0], `preliminar/${newProblem._id}`).subscribe({
              next: () => {},
              error: (err) => { console.log(err);}
            });
            figure.url = GlobalConstants.concatenatePath(figure.url, `/preliminar/${newProblem._id}/`);
          });
        }
  
        if (thereImagesInOptions) {
          newProblem.options.forEach((option) => {
            if (GlobalConstants.isLink(option.answer)) {
              this.testService.moveFile(option.answer.split('/').slice(-1)[0], `preliminar/${newProblem._id}`).subscribe({
                next: () => {},
                error: (err) => { console.log(err);}
              });
              option.answer = GlobalConstants.concatenatePath(option.answer, `/preliminar/${newProblem._id}/`);
            }
          });
        }

        if (thereFigures || thereImagesInOptions) {
          this.testService.updateProblem('', -1, newProblem).subscribe({
            next: (res) => {},
            error: (err) => {}
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Problema agregado ✅' });
    setTimeout(() => {
      this.location.back();
    }, 1220);
  }

  validateStatement() {
    return this.addNewProblemForm.controls['statement']?.invalid && this.addNewProblemForm.controls['statement']?.touched;
  }

  disabledNewProblem() {
    return this.addNewProblemForm.invalid || 
           !this.newProblem.options.every(option => option.answer.trim() !== '') ||
           !this.newProblem.solution;
  }

  back() {
    this.location.back()
  }
}
