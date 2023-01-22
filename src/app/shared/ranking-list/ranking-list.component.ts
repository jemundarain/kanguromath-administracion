import { Component, Input, OnInit } from '@angular/core';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html'
})
export class RankingListComponent implements OnInit {

  constructor() { }
  @Input() rankings: Ranking[];

  ngOnInit(): void {

  }

}
