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

  testForm: FormGroup;
  test: Test;
  testSub = new Subscription();
  private paramId: string;

  constructor(private testService: TestService, private router: Router, private activatedRoute: ActivatedRoute) { }

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

    // this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
    //   if(paramMap.has('id')){
    //     this.paramId = paramMap.get('id')!;
    //     this.testService.getTestById(this.paramId);
    //     this.testSub = this.testService.testSubject.subscribe(test => {
    //       this.test = test;
    //     });
    //   }
    // })

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => this.test = test );
    
    this.testForm = new FormGroup({
      edition: new FormControl( 2020, [Validators.required]),
      level: new FormControl(  '', [Validators.required])
    })
  }
  
  onSubmit(){
    const test = new Test('', this.testForm.value.levels, this.testForm.value.edition, ['']);
    console.log(this.paramId);
  }
}
