import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { SlideMenuComponent } from './slide-menu/slide-menu.component';
@NgModule({
  declarations: [
    SlideMenuComponent
  ],
  exports: [
    SlideMenuComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ]
})
export class ComponentsModule { }
