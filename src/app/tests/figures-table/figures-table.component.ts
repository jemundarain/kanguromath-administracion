import { Component, Input, OnInit } from '@angular/core';
import { Figure } from '../models/figure-model';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor( private testService: TestService) { }

  @Input() figures: Figure[] = [];
  @Input() problem_id: string;
  position: string;
  contents: any = null;
  filename: string;

  ngOnInit(): void {
  }

  setPosition(position: string){
    this.position = position;
  }
}
