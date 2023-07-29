import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { AdminUserService } from '../../../admin-users/services/admin-user.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent implements OnInit {

  constructor(
    private adminUserService: AdminUserService,
    private messageService: MessageService
  ) { }

  @ViewChild('recoverPasswordForm', { static: true }) recoverPasswordForm!: NgForm;
  id: string;
  loading: boolean;

  ngOnInit(): void {
  }

  recoverPassword() {
    this.adminUserService.sendRecoverEmail(this.recoverPasswordForm.form.value.id).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Te enviamos un correo electrónico para recuperar tu contraseña', life: 3250});
        this.recoverPasswordForm.resetForm();
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'Error al enviar el correo electrónico', life: 3250});
      }
    });
  }

  validateId() {
    return this.recoverPasswordForm.controls['id']?.invalid && this.recoverPasswordForm.controls['id']?.touched;
  }


}
