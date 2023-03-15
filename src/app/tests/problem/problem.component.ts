import { Component, Input, OnInit } from '@angular/core';
import { Problem } from '../models/problem-model';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styles:[ `
    .right-img {
      max-width: 180px !important;
      height: auto !important;
    }
    .option-img {
      max-width: 100px !important;
    }

  `]
})
export class ProblemComponent implements OnInit {

  @Input() problem: Problem;
  public body_problem: string;
  public right_img_url: string;
  public decode_statement: string;
  constructor() { }

  ngOnInit(): void {
    this.decode_statement = this.problem.statement;
    let n=0;
    for(let i=0; i<this.problem.statement.length; i++) {
      if(this.problem.statement[i] == '{' && this.problem.statement[i+1] == '*' && (this.problem.statement[i+4] == '}' || this.problem.statement[i+5] == '}')) {
        this.decode_statement = this.decode_statement.replace(`{*${n+1}*}`, `<img src="${this.problem.figures[n].url}">`)
        n++;
      }
    }
    this.body_problem = `<b>${this.problem.num_s}.</b> ${this.decode_statement}`;
    for(let i=this.problem.figures.length-1; i>=0; i--) {
      if(this.problem.figures[i].position === 'derecha')
        this.right_img_url = this.problem.figures[i].url;
    }
  }

  isLink(answer: string) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(answer);
  }
}
