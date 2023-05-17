import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RadioOption } from '../../common/radio-option.interface';
import { Test } from '../models/test-model';
import { MenuItem, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { TestService } from '../services/test.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html',
  providers: [MessageService]
})
export class NewTestComponent implements OnInit {

  minEdition: number = GlobalConstants.MIN_DATE_EDITION;
  maxEdition: number = GlobalConstants.MAX_DATE_EDITION;
  test: Test;
  levels: RadioOption[];
  selectedLevelCode: string;
  items: MenuItem[];
  uploadUrl: string = 'http://localhost:3000/admin_uploads/post_test/';
  @ViewChild('addTestForm', { static: true }) addTestForm!: NgForm;
  @ViewChild('uploadTestForm', { static: true }) uploadTestForm!: NgForm;
  @ViewChild('uploadBtn') uploadBtn!: FileUpload;

  constructor( private testService: TestService,
               private location: Location,
               private messageService: MessageService,
               private router: Router ) { }

  ngOnInit(): void {
    this.addTestForm.form.valueChanges.subscribe((data) => {
      this.testService.getLevelsByEdition(data.edition).subscribe(levels => { 
        this.levels = this.filterLevels(levels);
      });
    });
    this.test = new Test('', '', '', GlobalConstants.MAX_DATE_EDITION.toString(), false, [])
    this.items = [
      {label: 'Pruebas'},
      {label: 'Prueba nueva'}
    ];
  }

  filterLevels(levels: string[]): RadioOption[] {
    return GlobalConstants.LEVELS.filter(level => {
      for (let i = 0; i < levels.length; i++) {
        if (levels[i] === '1ero-2do' && (level.code === '1ero' || level.code === '2do' || level.code === '2do-3ero')) {
          return false;
        }
        if (levels[i] === '2do' && (level.code === '1ero-2do' || level.code === '2do' || level.code === '2do-3ero')) {
          return false;
        }
        if (levels[i] === '5to' && (level.code === '4to-5to' || level.code === '5to')) {
          return false;
        }
        if (levels[i].includes(level.code)) {
          return false;
        }
        if (level.code.includes(levels[i])) {
          return false;
        }
      }
      return true;
    });
  }                      

  onBasicUpload(ev: any) {    
    console.log("ESTOY EN onBasicUpload -> EVENTO ", ev)
  }

  addManualTest() {
    this.test.test_id = `preliminar-${this.test.edition}-${this.test.levels}`;
    this.testService.addNewTest(this.test);
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250});
    setTimeout(() => {
      this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
    }, 1220);
  }

  uploadTest() {
    this.test.test_id = `preliminar-${this.test.edition}-${this.test.levels}`;
    this.uploadUrl += this.test.test_id;
    console.log(this.uploadUrl);
    this.uploadBtn.upload();
    // this.testService.addNewTest(this.test);
    // this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250});
    // setTimeout(() => {
    //   this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
    // }, 1220);
  }

}