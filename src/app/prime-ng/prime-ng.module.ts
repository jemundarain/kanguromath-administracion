import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SlideMenuModule } from 'primeng/slidemenu';

@NgModule({
  exports: [
    ButtonModule,
    CardModule,
    SlideMenuModule
  ]
})
export class PrimeNgModule { }
