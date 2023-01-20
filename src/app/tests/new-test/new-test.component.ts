import { Component, OnInit } from '@angular/core';
import { LevelOption } from '../interfaces/level-option.interface';
import { Test } from '../test-model';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html'
})
export class NewTestComponent implements OnInit {

  value1: number = 0;
  min: number = 2002;
  currentYear: string = new Date().getFullYear().toString();

  test: Test = new Test('', '', '', this.currentYear, ['']);

  levels: LevelOption[];
  selectedLevelCode: string;

  items: MenuItem[];

  options: string[];
  option: string = 'Manual';

  ngOnInit(): void {
    this.options = [
      'Automática',
      'Manual'
    ]
    this.levels = [
      {name: '1ero', code: '1ero'},
      {name: '1ero y 2do', code: '1ero-2do'},
      {name: '2do', code: '2do'},
      {name: '3ero', code: '3ero'},
      {name: '4to', code: '4to'},
      {name: '4to y 5to', code: '4to-5to'},
      {name: '5to', code: '5to'}
    ]

    this.items = [
      {label: 'Step 1'},
      {label: 'Step 2'},
      {label: 'Step 3'}
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
