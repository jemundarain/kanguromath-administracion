import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListTestsComponent implements OnInit, OnDestroy {

  constructor(
    private testService: TestService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  @ViewChild('editionsForm', { static: true }) editionsForm!: NgForm;
  editions: string[];
  edition: string;
  tests: Test[];

  ngOnInit(): void {
    this.testService.getEditions()
    .subscribe( editions => {this.editions = editions});

    this.editionsForm?.form.valueChanges.subscribe((data) => {
      this.tests = [];
      this.testService.getTestsByEdition(data.edition)
      .subscribe( tests => this.tests = tests);
    })
  }
  
  ngOnDestroy(): void {
  }

  deleteTest(test: Test){
    this.confirmationService.confirm({
      header: "Confirmación",
      message: `¿Está seguro que desea eliminar la prueba preliminar ${test.edition} ${test.levels}?`,
      accept: () => {
        this.testService.deleteTest(test._id);
        this.messageService.add({ severity:'success', summary: 'Exitoso', detail: 'Prueba Eliminada' });
      },
      reject: () => {}
    });
  }
}
