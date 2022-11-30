import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TableModule } from 'primeng/table';

@NgModule({
  exports: [
    FormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FileUploadModule,
    InputNumberModule,
    SlideMenuModule,
    TableModule
  ]
})
export class PrimeNgModule { }
