import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PagesService } from '../services/pages.service';
import { Message } from 'primeng/api';
import { Global } from '../global-model'
import { TestService } from '../../tests/services/test.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [ConfirmationService, MessageService]
})
export class SettingsComponent implements OnInit {

  @ViewChild('settingsForm', {static: true}) settingsForm !: NgForm;

  state: boolean;
  global: Global;
  msgs: Message[] = [];
  position: string;
  checked = false;
  items: MenuItem[];
  
  constructor( private pagesService: PagesService,
               private confirmationService: ConfirmationService,
               private messageService: MessageService,
               private testService: TestService) { }

  ngOnInit(): void {
    this.pagesService.getAppState().subscribe((global) => {
      this.global = global;
      this.state = this.global.app_enabled;
    })

    this.settingsForm?.form.valueChanges.subscribe((data) => {
      const global = new Global(this.global?._id, data.state);
      this.pagesService.updateAppState(global);
    })

    this.items = [
      {label:'Pruebas'},
      {label:'Ajustes'}
    ];
  }

  confirm(e: any) {
    if (this.state) {
      this.confirmationService.confirm({
        header: "Confirmación",
        message: '¿Está seguro que desea activar la aplicación?',
        accept: () => {
          this.state = !e.state;
          this.showToast('activada');
        },
        reject: () => {
          this.state = e.state;
        }
      });
    } else {
      this.confirmationService.confirm({
        header: "Confirmación",
        message: '¿Está seguro que desea desactivar la aplicación?',
        accept: () => {
          this.state = e.state;
          this.showToast('desactivada');
        },
        reject: () => {
          this.state = !e.state;
        }
      });
    }
  }

  showToast(action: string) {
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Aplicación ' + action });
  }

  // transformationOne = [{ height: "200", width: "200" }];
  // path = "/default-image.jpg";

  // transformationTwo = [
  //   { height: "200", width: "200" },
  //   {
  //     rotation: "90"
  //   }
  // ];
  // lqip = { active: true, quality: 1 };
}
