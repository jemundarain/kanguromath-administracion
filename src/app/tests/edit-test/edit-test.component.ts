import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestService } from '../services/test.service';
import { LevelOption } from '../interfaces/level-option.interface';
import { Test } from '../test-model';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html'
})
export class EditTestComponent implements OnInit {

  edition: number = 0;
  minEdition: number = 2009;

  levels: LevelOption[];
  selectedLevelCode: string;

  test!: Test;

  constructor(private testService: TestService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.levels = [
      {name: '1ero', code: '1ero'},
      {name: '1ero y 2do', code: '1ero-2do'},
      {name: '2do', code: '2do'},
      {name: '3ero', code: '3ero'},
      {name: '4to', code: '4to'},
      {name: '4to y 5to', code: '4to-5to'},
      {name: '5to', code: '5to'}
    ]

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => this.test = test[0] );
  }
  
  onSubmit(){
  }
}
