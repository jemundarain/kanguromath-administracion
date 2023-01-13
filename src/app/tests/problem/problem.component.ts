import { Component, Input, OnInit } from '@angular/core';
import { Problem } from '../problem-model';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html'
})
export class ProblemComponent implements OnInit {

  @Input() problem: Problem;
  public body_problem: string;

  constructor() { }

  ngOnInit(): void {
    this.body_problem = `<b>${this.problem.num_s}.</b> ${this.problem.statement}`;
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
