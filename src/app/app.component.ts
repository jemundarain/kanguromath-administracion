import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { GlobalConstants } from './common/global-constants';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private primengConfing: PrimeNGConfig) {}  
  title = GlobalConstants.SITE_TITLE;

  ngOnInit() {
    this.primengConfing.ripple = true;
    this.primengConfing.setTranslation(GlobalConstants.TRANSLATION);
  }
}
