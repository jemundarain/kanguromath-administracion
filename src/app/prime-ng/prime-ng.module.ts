import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SlideMenuModule } from 'primeng/slidemenu';

@NgModule({
  exports: [
    ButtonModule,
    CardModule,
    DropdownModule,
    SlideMenuModule
  ]
})
export class PrimeNgModule { }
