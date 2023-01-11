import { Component, OnInit } from '@angular/core';
import { KatexOptions } from 'ng-katex';
import { Test } from '../test-model';
import { TestService } from '../services/test.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Problem } from '../problem-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-visualize-test',
  templateUrl: './visualize-test.component.html'
})
export class VisualizeTestComponent implements OnInit {

  constructor(private testService: TestService, private router: Router, private activatedRoute: ActivatedRoute) { }

  private paramId: string;
  test: Test;
  testSub = new Subscription();

  problem: Problem;
  problemSub = new Subscription();


  paragraph: string = `
  You can write text, that contains expressions like this: $x ^ 2 + 5$ inside them. As you probably know.
  You also can write expressions in display mode as follows: $$\\sum_{i=1}^n(x_i^2 - \\overline{x}^2)$$.
  In first case you will need to use \\$expression\\$ and in the second one \\$\\$expression\\$\\$.
  To scape the \\$ symbol it's mandatory to write as follows: \\\\$
`;

html: string = `
    <div>You can write html, that contains expressions like this: $x ^ 2 + 5$ inside them. As you probably know. You also can write expressions in display mode as follows: $$\\sum_{i=1}^n(x_i^2 - \\overline{x}^2)$$. In first case you will need to use \\$expression\\$ and in the second one \\$\\$expression\\$\\$. To scape the \\$ symbol it's mandatory to write as follows: \\\\$</div><p>: <button>I'm a button</button></p>
  `;
  

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.paramId = paramMap.get('id')!;
        // this.testService.getTestById(this.paramId);
        this.testSub = this.testService.testSubject.subscribe(test => {
          // console.log("TEST", test)
          // for(let i = 0; i<test[0].problems.length; i++) {
          //   this.testService.getProblemById(test.problems[i]);
          //   this.problemSub = this.testService.problemSubject.subscribe(problem => {
          //     this.problem = problem;
          //     console.log(`Problema #${i}: ${problem.statement}`);
          //   });
          // }
        });
      }
    })
  }

}
