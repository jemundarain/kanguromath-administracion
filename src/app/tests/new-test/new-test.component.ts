import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html'
})
export class NewTestComponent implements OnInit {

  value1: number = 0;
  min: number = 0;
  max: number = 10;
  
  testForm: FormGroup;

  ngOnInit(): void {
    this.testForm = new FormGroup({
      "name": new FormControl(null, [Validators.required])
    });    
  }

  onSubmit() {
    
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
