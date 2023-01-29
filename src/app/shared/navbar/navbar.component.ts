import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
      .pi-bars {
        font-size: 22px !important;
        color: #fff;
        padding: 3px !important;
      }
    `
  ],
  animations: [
    trigger('slidein', [
      transition(':enter', [
        // when ngif has true
        style({ transform: 'translateX(-100%)' }),
        animate(420, style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        // when ngIf has false
        animate(420, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {

  constructor() { }
  @Input() expanded: boolean;

  @Output() onEmitExpanded: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
  }

  emitExpanded() {
    this.onEmitExpanded.emit(this.expanded);
  }

}
