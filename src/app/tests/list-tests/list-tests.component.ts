import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { PageService } from 'src/app/pages/services/page.service';
import { TestService } from '../services/test.service';
import { Test } from '../models/test-model';

@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html',
  styles: [`
    .pi.pi-check {
      color: #16a34a !important;
    }
    .pi.pi-times {
      color: #dc2626 !important;
    }
  `],
  providers: [ConfirmationService, MessageService]
})
export class ListTestsComponent implements OnInit {

  @ViewChild('editionsForm', { static: true }) editionsForm!: NgForm;
  editions: string[];
  edition: string;
  tests: Test[];
  items: MenuItem[];
  error = false;
  testsEmpty = false;
  app_enabled: boolean;

  constructor(
    private testService: TestService,
    private pageService: PageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editions = [];
  }

  ngOnInit() {
    this.items = [
      { label:'Pruebas' },
      { label:'Todas las pruebas' }
    ];

    this.testService.getEditions().subscribe({
      next: (editions) => {
        editions.length? this.editions = editions : this.testsEmpty = true;
      },
      error: (err) => {
        this.error = true;
      }
    });

    this.editionsForm?.form.valueChanges.subscribe( data => {
      this.testService.getTestsByEdition(data.edition).subscribe( 
        tests => this.tests = tests
      );
    });

    this.pageService.getAppState().subscribe(
      global => this.app_enabled = global.app_enabled
    );

  }
  
  appDisabledAlert() {
    this.messageService.add({ severity:'error', summary: 'Rechazado', detail: 'Es necesario deshabilitar la aplicación' });
  }

  deleteTest(test: Test){
    this.confirmationService.confirm({
      header: "Confirmación",
      message: `¿Está seguro que desea eliminar la prueba preliminar ${test.edition} ${test.levels}?`,
      accept: () => {
        this.testService.deleteTest(test._id).subscribe({
          next: (successful) => {
            this.messageService.add({ severity:'success', summary: 'Exitoso', detail: 'Prueba Eliminada 🗑', life: 3250 });
            setTimeout(() => {
              location.reload();
            }, 1220);
          },
          error: (err) => {
            this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'La prueba no fue eliminada 🙁', life: 3250});
          }
        });
      },
      reject: () => {}
    });
  }
}
