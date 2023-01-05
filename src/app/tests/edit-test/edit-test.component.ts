import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestService } from '../services/test.service';
import { LevelOption } from '../interfaces/level-option.interface'

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html'
})
export class EditTestComponent implements OnInit {

  edition: number = 0;
  minEdition: number = 2009;

  levels: LevelOption[];
  selectedLevelCode: string;

  testForm: FormGroup;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.levels = [
      {name: '1ero', code: '1ero'},
      {name: '1ero y 2do', code: '1ero-2d0'},
      {name: '2do', code: '2do'},
      {name: '3ero', code: '3ero'},
      {name: '4to', code: '4to'},
      {name: '4to y 5to', code: '4to-5to'},
      {name: '5to', code: '5to'}
    ]

    this.testForm = new FormGroup({
      // 'edition': new FormControl(this.editMode ? this.diaryEntry.date : '', [Validators.required]),
      // 'entry': new FormControl(this.editMode ? this.diaryEntry.entry : '', [Validators.required])
    })
  }

  onSubmit() {
    
  }
}
