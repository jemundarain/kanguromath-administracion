import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Figure } from '../models/figure-model';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor( private testService: TestService) { }

  @Input() figures: Figure[] = [];
  @Input() _id: string;
  uploadings: boolean[] = [];

  ngOnInit(): void {
    GlobalConstants.generateRandomSuffix();
  }

  getRandomFigureName(num_s: number) {
    return GlobalConstants.getRandomName(num_s.toString());
  }

  addFigure(newFigure: any) {
    GlobalConstants.generateRandomSuffix();
    if(this.figures[newFigure.num_s-1].ik_id) {
      this.testService.deleteFigure(this.figures[newFigure.num_s-1].ik_id);
    }
    this.figures[newFigure.num_s-1] = newFigure;
    this.uploadings[newFigure.num_s-1] = false;
  }

  deleteFigure(num_s: number) {
    this.testService.deleteFigure(this.figures[num_s-1].ik_id);
    this.figures.splice(num_s-1, 1);
    for(let i=0; i<this.figures.length; i++) {
      this.figures[i].num_s = i+1;
    }
  }

}
