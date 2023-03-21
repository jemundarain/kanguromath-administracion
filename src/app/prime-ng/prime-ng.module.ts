import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  exports: [
    AccordionModule,
    ButtonModule,
    BreadcrumbModule,
    CalendarModule,
    CardModule,
    ChartModule,
    ConfirmDialogModule,
    DropdownModule,
    FileUploadModule,
    FormsModule,
    ImageModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextareaModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ScrollTopModule,
    SelectButtonModule,
    SlideMenuModule,
    StepsModule,
    TableModule,
    ToastModule,
    TooltipModule
  ]
})
export class PrimeNgModule { }
