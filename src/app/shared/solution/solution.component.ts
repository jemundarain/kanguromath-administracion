import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html'
})
export class SolutionComponent implements OnInit {

  solutionOut: string;
  options = GlobalConstants.OPTIONS_LETTERS;
  @Input() solution: string;
  @Output() onChangeSolution: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.solutionOut = this.solution;
  }

  onSelectionChange() {
    this.onChangeSolution.emit(this.solutionOut);
  }
}
