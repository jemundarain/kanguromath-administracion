import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { PagesService } from '../services/pages.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  @ViewChild('settingsForm', {static: true}) settingsForm !: NgForm;
  state: boolean;
  // constructor( private pagesService: PagesService, private confirmationService: ConfirmationService, private messageService: MessageService ) { }
  constructor( public pagesService: PagesService ) { }

  ngOnInit(): void {
    this.pagesService.getAppState().subscribe((state) => {
      this.state = state;
    })
  }
  
  confirm1() {
    // this.confirmationService.confirm({
    //     message: 'Are you sure that you want to proceed?',
    //     header: 'Confirmation',
    //     icon: 'pi pi-exclamation-triangle',
    //     accept: () => {
    //         this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
    //     },
        // reject: (type) => {
        //     switch(type) {
        //         case ConfirmEventType.REJECT:
        //             this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
        //         break;
        //         case ConfirmEventType.CANCEL:
        //             this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
        //         break;
        //     }
        // }
    // });
  }
}
