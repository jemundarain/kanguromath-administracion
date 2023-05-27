import { Component, OnChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { PrimeNGConfig } from 'primeng/api';

import { GlobalConstants } from './common/global-constants';
import { AuthService } from './auth/services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
export class AppComponent {
  
  title = GlobalConstants.SITE_TITLE;
  expanded: boolean = true;
  loggedIn: boolean;
  constructor(private primengConfing: PrimeNGConfig, private authService: AuthService) {}  
  
  ngOnInit() {
    this.authService.isLoggedIn.subscribe((loggedIn) => this.loggedIn = loggedIn);
    this.primengConfing.ripple = true;
    this.primengConfing.setTranslation(GlobalConstants.TRANSLATION);
  }
}
