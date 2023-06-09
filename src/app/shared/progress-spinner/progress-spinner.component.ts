import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: []
})
export class ProgressSpinnerComponent {

  @Input() condition: any;

  constructor() { }
}
