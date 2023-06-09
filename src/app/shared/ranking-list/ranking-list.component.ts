import { Component, Input } from '@angular/core';

import { Ranking } from 'src/app/pages/interfaces/ranking.interfaces';

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html'
})
export class RankingListComponent {

  @Input() rankings: Ranking[];

  constructor() { }
}
