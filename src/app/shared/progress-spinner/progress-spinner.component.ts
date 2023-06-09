import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: []
})
export class ProgressSpinnerComponent implements OnInit {

  constructor() { }

  @Input() condition: any;

  ngOnInit(): void {
  }

}
