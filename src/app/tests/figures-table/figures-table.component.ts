import { Component, Input, OnInit } from '@angular/core';
import { Figure } from '../models/figure-model';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor( private testService: TestService) { }

  @Input() figures: Figure[];
  position: string;

  ngOnInit(): void {
    this.testService.getProblemById
  }

  onBasicUpload() {
    
  }

  setPosition(position: string){
    this.position = position;
  }
}
