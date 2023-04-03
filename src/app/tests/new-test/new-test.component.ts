import { Component, OnInit, ViewChild } from '@angular/core';
import { RadioOption } from '../../common/radio-option.interface';
import { Test } from '../models/test-model';
import { MenuItem, MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { TestService } from '../services/test.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
  @ViewChild('addTestForm', { static: true }) addTestForm!: NgForm;

  constructor( private testService: TestService,
               private location: Location,
               private messageService: MessageService,
               private router: Router ) { }

  public filterLevels(levels: string[]): RadioOption[] {
    const filteredLevels = GlobalConstants.LEVELS.filter(level => !levels.includes(level.code));
    return filteredLevels;
  }

  ngOnInit(): void {
    this.addTestForm.form.valueChanges.subscribe((data) => {
      this.testService.getLevelsByEdition(data.edition).subscribe(levels => { 
        this.levels = this.filterLevels(levels);
      });
    });
    this.test = new Test('', '', '', GlobalConstants.MAX_DATE_EDITION.toString(), false, [''])
    this.items = [
      {label: 'Pruebas'},
      {label: 'Prueba nueva'}
    ];
  }

  onBasicUpload() {    
  }

  addManualTest() {
    this.test.test_id = `preliminar-${this.test.edition}-${this.test.levels}`;
    this.testService.addNewTest(this.test);
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba creada 🎉', life: 3250});
    setTimeout(() => {
      this.router.navigate([`/pruebas/ver/${this.test.test_id}`]);
    }, 3250);
  }

}