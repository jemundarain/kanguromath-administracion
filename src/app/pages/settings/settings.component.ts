import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { PagesService } from '../services/pages.service';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Global } from '../global-model'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [ConfirmationService]
})
export class SettingsComponent implements OnInit {

  @ViewChild('settingsForm', {static: true}) settingsForm !: NgForm;
  state: boolean;
  global: Global;
  msgs: Message[] = [];

    position: string;
  // constructor( private pagesService: PagesService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) { }
  constructor( private pagesService: PagesService ) { }

  ngOnInit(): void {
    this.pagesService.getAppState().subscribe((global) => {
      this.global = global;
      this.state = this.global.app_enabled;
    })

    this.settingsForm.form.valueChanges.subscribe((data) => {
      const global = new Global(this.global?._id, data.state);
      this.pagesService.updateAppState(global);
    })
  }

  updateState() {
    const global = new Global(this.global._id, !this.global.app_enabled);
    this.pagesService.updateAppState(global);
  }
  
//   confirm1() {
//     this.confirmationService.confirm({
//       message: 'Are you sure that you want to proceed?',
//       header: 'Confirmation',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//           this.msgs = [{severity:'info', summary:'Confirmed', detail:'You have accepted'}];
//       },
//       reject: () => {
//           this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
//       }
//     });
//   }
}
