import { Component } from '@angular/core';
interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html',
  styleUrls: ['./new-test.component.scss']
})
export class NewTestComponent {
  value1: number = 0;
  min: number = 0;
  max: number = 10;

  selectedCity: City = {
    name: "",
    code: ""
  };

  cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
  
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
