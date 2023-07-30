import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AdminUser } from 'src/app/admin-users/models/adminUser-model';
import { Avatar } from 'src/app/admin-users/models/avatar-model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  @ViewChild('resetPasswordForm', { static: true }) resetPasswordForm!: NgForm;
  password: string;
  loading: boolean;
  adminUser: AdminUser = new AdminUser('', '', '', '', new Avatar('', '', ''), '', '', new Date, '');

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({ token }) => {
        return this.authService.validateRecoveryToken(token);
      })
    ).subscribe({
      next: (res:any) => {
        this.adminUser = res.adminUser;
      },
      error: (err) => {

      }
    });
  }

  validatePassword() {
    const password = this.resetPasswordForm.form.value.password;
    return !password || password.length < 8;
  }

  resetPassword() {
    this.authService.setNewPassword(this.adminUser._id, this.password).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary: 'Exitoso', detail: 'Tu contraseña ha sido cambiada', life: 3250});
        this.resetPasswordForm.resetForm();
        setTimeout(() => {
          this.router.navigate(['/auth/iniciar-sesion']);
        }, 1220);
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Exitoso', detail: 'Tu contraseña no pudo ser cambiada', life: 3250});
        this.resetPasswordForm.resetForm();
      }
    });
  }

}
