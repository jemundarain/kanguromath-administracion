import { Component, OnInit } from '@angular/core';
import { RadioOption } from '../../common/radio-option.interface';
import { Test } from '../models/test-model';
import {MenuItem} from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html'
})
export class NewTestComponent implements OnInit {

  value1: number = 0;
  minEdition: number = GlobalConstants.MIN_DATE_EDITION;
  maxEdition: number = GlobalConstants.MAX_DATE_EDITION;

  test: Test = new Test('', '', '', GlobalConstants.MAX_DATE_EDITION.toString(), false, ['']);

  levels: RadioOption[];
  selectedLevelCode: string;

  items: MenuItem[];

  options: string[];
  option: string = GlobalConstants.UPLOAD_OPTIONS[0];

  ngOnInit(): void {
    this.options = GlobalConstants.UPLOAD_OPTIONS;
    this.levels = GlobalConstants.LEVELS;

    this.items = [
      {label: 'Pruebas'},
      {label: 'Prueba nueva'}
    ];
  }

  onBasicUpload() {    
  }

  addTest(test: Test) {

  }
  // uploadedFiles: any[] = [];

  // constructor(private messageService: MessageService) {}

  // onUpload(event: any) {
  //     for (const file of event.files) {
  //         this.uploadedFiles.push(file);
  //     }

  //     this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  // }

  // onBasicUpload() {
  //     this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  // }



}
