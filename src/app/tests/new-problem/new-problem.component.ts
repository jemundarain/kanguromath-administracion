import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../models/problem-model';
import { Subject, switchMap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { Option } from '../../shared/option-model';
import { NgForm } from '@angular/forms';
import { Figure } from '../models/figure-model';
import { Location } from '@angular/common'
import * as htmlToText from 'html-to-text';
import { OptionsComponent } from 'src/app/shared/options/options.component';

@Component({
  selector: 'app-new-problem-component',
  templateUrl: './new-problem.component.html',
  providers: [MessageService]
})
export class NewProblemComponent implements OnInit {

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private location: Location
  ) { }
  @ViewChild('addNewProblemForm', { static: true }) addNewProblemForm !: NgForm;
  @ViewChild('addExistingProblemForm', { static: true }) addExistingProblemForm !: NgForm;
  items: MenuItem[];
  test: Test;
  options: string[];
  option: string = GlobalConstants.NEW_PROBLEM_OPTIONS[0];
  newProblem: Problem;
  problemSelected: Problem;
  suggestedProblems: Problem[];
  num_s: number;
  error: boolean;
  term: string;
  figuresMap1 = GlobalConstants.FIGURES_MAP1;
  figuresMap2 = GlobalConstants.FIGURES_MAP2;

  @ViewChild('appOptions', { static: true }) appOptions: OptionsComponent;

  ngOnInit(): void {
    this.options = GlobalConstants.NEW_PROBLEM_OPTIONS;
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => {
        this.test = test;
        this.num_s = this.test.problems.length+1;
        this.newProblem = new Problem('', '', this.test.problems.length+1, '', '', 'sin-categoria', [ new Option("", "A","", ""), new Option("", "B", "", ""), new Option("", "C","", ""), new Option("", "D", "", ""), new Option("", "E", "", "") ], []);
        this.items = [
          {label: 'Pruebas'},
          {label: `Preliminar ${this.test.edition} ${this.test.levels}`},
          {label: `Problema #${this.num_s}`}
        ];
      });

      // this.addExistingProblemForm.form.valueChanges.subscribe(({search}) => {
      //   this.testService.searchProblem(search);
      // })
      
      // this.addExistingProblemForm.form.valueChanges.subscribe(({search}) => {
      //   this.testService.searchProblem(search);
      // })

  }

  addFigure() {
    this.newProblem.figures.push(new Figure('', '' , this.newProblem.figures.length + 1, '', 'intermedia'));
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
    this.testService.addExistingProblem(this.test.test_id, this.problemSelected.problem_id);
  }

  saveNewProblem() {
    this.newProblem.problem_id = this.stringToSlug(this.newProblem.statement);
    this.testService.addNewProblem(this.newProblem, this.test._id);
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Problema agregado ✅' });
    setTimeout(() => {
      this.location.back()
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
  
  stringToSlug(str: string): string {
    str = str.replace(/\\(begin|end)\{(?:pspicture|postscript|TeXtoEPS|pdfpicture)\}[\s\S]*?\\(end|begin)\{(?:pspicture|postscript|TeXtoEPS|pdfpicture)\}|\\(?:psline|psframe|pscircle|psdots|pstext|psset|SpecialCoor|uput|degrees|psarc|qdisk|qline|qbezier|qlcurve|qccurve|pstVerb|newpath|moveto|lineto|arc|closepath|stroke|fill|gsave|grestore|show|quad|includegraphics|medskip|smallskip|it|raisebox)\b/g, '')
             .replace(/\\[a-zA-Z]+{[^}]*}/g, '')
             .replace(/^\s+|\s+$/g, '') // trim
             .replace(/\{\*.*\*\}/g, '') // Eliminar mis etiquetas para las imagenes intermedias
             .replace(/\{.*\}/g, '') // remove LaTeX tags
             .replace(/\[.*\]/g, '') // remove LaTeX tags
             .replace(/\{/g, '') // remove LaTeX tags
             .replace(/\}/g, '') // remove LaTeX tags
             .replace(/\?/g, '') // remove LaTeX tags
             .replace(/\\/g, '') // remove LaTeX tags
             .replace(/\$.*?\$/g, '')
             .replace(/-+$/, '')
             .replace(/\./g, '')
             .replace(/\s+/g, '-') // collapse whitespace and replace by -
             .toLowerCase();
    str = htmlToText.convert(str);

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;¿`";
    var to   = "aaaaeeeeiiiioooouuuunc--------";
    for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/-+/g, '-')  //Simplificar guiones consecutivos duplicados

    if(str[str.length-1] === '-') {
      str = str.slice(0,-1);
    }

    if(str[0] === '-') {
      str = str.slice(1);
    }
    return str;
  }
}
