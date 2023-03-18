import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TestService } from '../services/test.service';
import { RadioOption } from '../../common/radio-option.interface';
import { Test } from '../models/test-model';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { switchMap } from 'rxjs';
import { GlobalConstants } from 'src/app/common/global-constants';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  providers: [MessageService]
})
export class EditTestComponent implements OnInit {

  edition: number = 0;
  minEdition: number = GlobalConstants.MIN_DATE_EDITION;
  maxEdition: number = GlobalConstants.MAX_DATE_EDITION;

  levels: RadioOption[];
  selectedLevelCode: string;

  test!: Test;

  @ViewChild('editTestForm') editTestForm!: NgForm;

  constructor( private testService: TestService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private messageService: MessageService) { }

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
    this.testService.updateTest(test);
    this.router.navigateByUrl('pruebas/lista');
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba editada'});
  }
}
