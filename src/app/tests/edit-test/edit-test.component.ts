import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TestService } from '../services/test.service';
import { LevelOption } from '../interfaces/level-option.interface';
import { Test } from '../models/test-model';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';

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

  @ViewChild('editTestForm') editTestForm!: NgForm;

  constructor(private testService: TestService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.levels = GlobalConstants.LEVELS;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.testService.getTestById(id))
      )
      .subscribe( test => this.test = test );
  }
  
  updateTest() {
    const test = new Test(this.test._id, this.test.test_id, this.editTestForm?.form.value.levels, this.editTestForm?.form.value.edition, this.test.problems);
    this.testService.updateTest(this.test._id, test);
    this.router.navigateByUrl('pruebas/lista');
  }
}
