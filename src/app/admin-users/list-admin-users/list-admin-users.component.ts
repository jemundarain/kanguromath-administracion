import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUser } from '../models/adminUser-model';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AdminUserService } from '../services/admin-user.service';

@Component({
  selector: 'app-list-admin-users',
  templateUrl: './list-admin-users.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListAdminUsersComponent implements OnInit {

  constructor(
    private adminUserService: AdminUserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  adminUsers: AdminUser[];
  items: MenuItem[];
  error = false;
  app_enabled: boolean;

  ngOnInit(): void {
    this.items = [
      {label:'Usuarios'},
      {label:'Todos los usuarios'}
    ];

    this.adminUserService.getAdminUsers()
      .subscribe({
        next: (adminUsers) => {
          this.adminUsers = adminUsers;
        },
        error: (err) => {
          this.error = true;
        }
      });
  }
  
  appDisabledAlert() {
    this.messageService.add({ severity:'error', summary: 'Rechazado', detail: 'Es necesario deshabilitar la aplicación' });
  }

  deleteUser(adminUser: any) {
    this.confirmationService.confirm({
      header: "Confirmación",
      message: `¿Está seguro que desea eliminar el usuario ${adminUser.username}?`,
      accept: () => {
        this.adminUserService.deletedAdminUser(adminUser._id).subscribe({
          next: (res) => {
            this.messageService.add({ severity:'success', summary: 'Exitoso', detail: 'Usuario Eliminado 🗑' });
            setTimeout(() => {
              location.reload();
            }, 1220);
          },
          error: (err) => {
            this.messageService.add({ severity:'error', summary: 'Exitoso', detail: 'El usuario no fue eliminado 🙁' });
          }
        });
      },
      reject: () => {}
    });
  }

  // deleteTest(test: Test){
  //   this.confirmationService.confirm({
  //     header: "Confirmación",
  //     message: `¿Está seguro que desea eliminar la prueba preliminar ${test.edition} ${test.levels}?`,
  //     accept: () => {
  //       this.testService.deleteTest(test._id);
  //       this.messageService.add({ severity:'success', summary: 'Exitoso', detail: 'Prueba Eliminada 🗑' });
  //       setTimeout(() => {
  //         location.reload();
  //       }, 1220);
  //     },
  //     reject: () => {}
  //   });
  // }
}
