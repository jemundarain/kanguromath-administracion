import { Component, OnInit } from '@angular/core';
import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html'
})
export class RankingListComponent implements OnInit {

  constructor() { }
  public rankings: Ranking[];

  ngOnInit(): void {
    this.rankings = [
      {
        state: "Distrito Capital",
        number: 120
      },
      {
        state: "Miranda",
        number: 60
      },
      {
        state: "Bolívar",
        number: 20
      }
    ]
  }

}
