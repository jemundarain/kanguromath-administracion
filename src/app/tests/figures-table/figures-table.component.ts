import { Component, Input, OnInit } from '@angular/core';
import { Figure } from '../models/figure-model';

@Component({
  selector: 'app-figures-table',
  templateUrl: './figures-table.component.html'
})
export class FiguresTableComponent implements OnInit {

  constructor() { }

  @Input() figures: Figure[]
  posiciones: string[] = [];
  selectedPosicion: string;

  ngOnInit(): void {
    this.posiciones = ['intermedia', 'derecha'];
  }

  onBasicUpload() {
    
  }
}
