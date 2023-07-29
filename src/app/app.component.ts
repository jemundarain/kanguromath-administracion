import { Component, OnChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { PrimeNGConfig } from 'primeng/api';

import { GlobalConstants } from './common/global-constants';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
