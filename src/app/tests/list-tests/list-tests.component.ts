import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PagesService } from 'src/app/pages/services/pages.service';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListTestsComponent implements OnInit, OnDestroy {

  constructor(
    private testService: TestService,
    private pagesService: PagesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  @ViewChild('editionsForm', { static: true }) editionsForm!: NgForm;
  editions: string[];
  edition: string;
  tests: Test[];
  items: MenuItem[];
  app_enabled: boolean;

  ngOnInit(): void {
    this.items = [
      {label:'Pruebas'},
      {label:'Todas las pruebas'}
    ];

    this.testService.getEditions()
    .subscribe( editions => {this.editions = editions});

    this.editionsForm?.form.valueChanges.subscribe((data) => {
      this.tests = [];
      this.testService.getTestsByEdition(data.edition)
      .subscribe( tests => this.tests = tests);
    })

    this.pagesService.getAppState().subscribe((global) => {
      this.app_enabled = global.app_enabled;
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
