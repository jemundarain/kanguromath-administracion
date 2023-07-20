import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Message } from 'primeng/api';
import { PagesService } from '../services/pages.service';
import { Global } from '../global-model'

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
  error = false;
  
  constructor(
    private pagesService: PagesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.items = [
      {label:'Pruebas'},
      {label:'Ajustes'}
    ];

    this.pagesService.getAppState().subscribe({
      next: (global) => {
        this.global = global;
        this.state = this.global.app_enabled;
      },
      error: (err) => {
        this.error = true;
      }
    })

    this.settingsForm?.form.valueChanges.subscribe((value) => {
      const global = new Global(this.global?._id, value.state);
      this.pagesService.updateAppState(global).subscribe({
        next: (res) => {
        },
        error: (err) => {
        }
      });
    })
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
    this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Aplicación ' + action + ' 📱' });
  }
}
