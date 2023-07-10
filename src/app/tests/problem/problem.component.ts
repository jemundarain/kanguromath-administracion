import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Problem } from '../models/problem-model';
import { PagesService } from '../../pages/services/pages.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TestService } from '../services/test.service';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styles:[ `
    .right-img {
      max-width: 240px !important;
      height: auto !important;
    }
    .option-img {
      max-width: 100px !important;
    }

  `],
  providers: [ConfirmationService, MessageService]
})
export class ProblemComponent implements OnChanges {

  @Input() problem: Problem;
  @Input() test_id: string;
  @Input() num_s: number;
  public body_problem: string;
  public right_img_url: string;
  public decode_statement: string;
  public app_enabled: boolean;
  
  constructor(
    private pagesService: PagesService,
    private testService: TestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnChanges(): void {
    this.pagesService.getAppState().subscribe((global) => {
      this.app_enabled = global.app_enabled;
    })
    this.right_img_url = '';
    this.decode_statement = this.problem.statement;
    let n=0;
    for(let i=0; i<this.problem.statement.length; i++) {
      if(this.problem.statement[i] == '{' && this.problem.statement[i+1] == '*' && (this.problem.statement[i+4] == '}' || this.problem.statement[i+5] == '}')) {
        this.decode_statement = this.decode_statement.replace(`{*${n+1}*}`, `<img src="${this.problem.figures[n].url}" style="display: inline;">`)
        n++;
      }
    }
    this.body_problem = `<b>${this.num_s}.</b> ${this.decode_statement}`;
    for(let i=this.problem.figures.length-1; i>=0; i--) {
      if(this.problem.figures[i].position === 'derecha') {
        this.right_img_url = this.problem.figures[i].url;
      }
    }
  }

  isLink(answer: string) {
    return GlobalConstants.isLink(answer);
  }

  deleteProblem(problem: Problem){
    this.confirmationService.confirm({
      header: "Confirmación",
      message: `¿Está seguro que desea eliminar el problema #${this.num_s}?`,
      accept: () => {
        this.testService.deleteProblem(this.test_id, problem._id);
        this.messageService.add({ severity:'success', summary: 'Exitoso', detail: `Problema #${this.num_s} eliminado 🗑` });
        setTimeout(() => {
          location.reload();
        }, 1220);
      },
      reject: () => {}
    });
  }
}
