import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html'
})
export class SolutionComponent implements OnInit {

  constructor() { }
  @Input() solution: string;
  solutionOut: string;
  @Output() onChangeSolution: EventEmitter<string> = new EventEmitter();
  options = GlobalConstants.OPTIONS_LETTERS;

  ngOnInit(): void {
    this.solutionOut = this.solution;
  }

  onSelectionChange() {
    this.onChangeSolution.emit(this.solutionOut);
  }
}
