import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common'
import { ActivatedRoute} from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';

import { TestService } from '../services/test.service';
import { RadioOption } from '../../common/radio-option.interface';
import { Test } from '../models/test-model';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-edit-test',
  templateUrl: './edit-test.component.html',
  providers: [ConfirmationService, MessageService]
})
export class EditTestComponent implements OnInit {

  @ViewChild('editTestForm', { static: true }) editTestForm!: NgForm;
  edition: number = 0;
  minEdition: number = GlobalConstants.MIN_DATE_EDITION;
  maxEdition: number = GlobalConstants.MAX_DATE_EDITION;
  levels: RadioOption[];
  selectedLevelCode: string;
  items: MenuItem[];
  test!: Test;

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private location: Location,
    private messageService: MessageService
  ) { }
  
  ngOnInit() {
    this.activatedRoute.params
      .pipe( switchMap( ({ id }) => this.testService.getTestById(id)))
      .subscribe( test => {
        this.test = test;
        this.items = [
          {label: 'Pruebas'},
          {label: 'Editar Prueba'},
          {label: `Preliminar ${this.test.edition} ${this.test.levels}`}
        ];
      });

    this.editTestForm.form.valueChanges.subscribe((data) => {
      this.testService.getLevelsByEdition(data.edition)
        .subscribe(levels => {
          this.levels = GlobalConstants.filterLevels(levels);
          GlobalConstants.LEVELS.filter(level => {
            if(this.test.levels.includes(level.code)) {
              this.levels.push(level);
            }
          })
        });
    });
  }

  validatePublished(e: any) {
    if((this.test.is_published) && (this.test.problems.length < 30)) {
      this.messageService.add({severity:'warn', summary: 'Rechazado', detail: 'No es posible publicar la prueba porque tiene menos de 30 problemas'});
    }
  }

  disabledEditTestSubmit() {
    return (this.test.is_published) && (this.test.problems.length < 30);
  }
  
  updateTest() {
    this.confirmationService.confirm({
      header: "Confirmación",
      message: '¿Está seguro que desea editar esta prueba?',
      accept: () => {
        this.testService.updateTest(this.test);
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Prueba editada 📝'});
        setTimeout(() => {
          this.location.back()
        }, 1220);
      }
    });
  }
}
