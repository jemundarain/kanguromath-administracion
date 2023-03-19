import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from '../option-model';
import { GlobalConstants } from 'src/app/common/global-constants';
import { TestService } from 'src/app/tests/services/test.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html'
})
export class OptionsComponent implements OnInit {

  constructor( private testService: TestService, ) { }
  @Input() options: Option[];
  @Input() problem_id: string;
  @Output() onChangeOptions: EventEmitter<Option[]> = new EventEmitter();
  optionsTypes:string[] = [];
  uploadings: boolean[] = [];
  optionsOut: Option[];

  ngOnInit(): void {
    for(let i=0; i<this.options.length; i++) {
      this.options[i].answer.includes('http')? this.optionsTypes[i] = 'figura': this.optionsTypes[i] = 'rutina';  
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
          this.testService.deleteFigure(this.options[i].ik_id);
        }
        this.options[i] = newOption;
        this.uploadings[i] = false;
      }
    }
  }

  generateRandomOptionFigureName(letter: string) {
    return `${ letter }-${ GlobalConstants.getRandomSuffix() }`
  }


}
