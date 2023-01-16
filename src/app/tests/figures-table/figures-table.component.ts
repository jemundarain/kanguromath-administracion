import { Component, Input, OnInit } from '@angular/core';
import { Figure } from '../figure-model';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor() { }

  @Input() figures: Figure[]

  ngOnInit(): void {
    console.log(this.figures);
  }

  onBasicUpload() {
    
  }
}
