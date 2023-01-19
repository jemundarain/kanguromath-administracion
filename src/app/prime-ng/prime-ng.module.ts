import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TableModule } from 'primeng/table';

import {InputSwitchModule} from 'primeng/inputswitch';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  exports: [
    FormsModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FileUploadModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    PasswordModule,
    RadioButtonModule,
    SlideMenuModule,
    TableModule,
    InputSwitchModule,
    ImageModule,
    CalendarModule,
    SelectButtonModule
  ]
})
export class PrimeNgModule { }
