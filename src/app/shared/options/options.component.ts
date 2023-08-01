import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

import { Option } from '../option-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { TestService } from 'src/app/tests/services/test.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class OptionsComponent implements OnInit {

  constructor(
    private testService: TestService
  ) { }

  @Input() options: Option[];
  @Input() folder: string;
  optionsTypes:string[] = [];
  uploadings: boolean[] = [];
  optionsOut: Option[];
  @Output() onChangeOptions: EventEmitter<Option[]> = new EventEmitter();

  @ViewChild('routineA', { static: true }) routineA: NgModel;
  @ViewChild('routineB', { static: true }) routineB: NgModel;
  @ViewChild('routineC', { static: true }) routineC: NgModel;
  @ViewChild('routineD', { static: true }) routineD: NgModel;
  @ViewChild('routineE', { static: true }) routineE: NgModel;

  ngOnInit(): void {
    GlobalConstants.generateRandomSuffix();
    for(let i=0; i<this.options.length; i++) {
      this.options[i].answer.includes('http')? this.optionsTypes[i] = 'figure': this.optionsTypes[i] = 'routine';  
    }
  }

  onSelectionChange() {
    this.onChangeOptions.emit(this.optionsOut);
  }
  
  addOptionFigure(newOption: Option) {
    GlobalConstants.generateRandomSuffix();
    for(let i=0; i < this.options.length; i++) {
      if(this.options[i].letter === newOption.letter) {
        if(this.options[i].ik_id) {
          this.testService.deleteImage(this.options[i].ik_id).subscribe();
        }
        this.options[i] = newOption;
        this.uploadings[i] = false;
      }
    }
  }

  generateRandomOptionFigureName(letter: string) {
    return `${ letter }-${ GlobalConstants.getRandomSuffix() }`
  }

  validateOption() {
    return true;
  }
}
