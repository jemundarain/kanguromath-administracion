import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private authService: AuthService,
  ) { }

  @ViewChild('resetPasswordForm', { static: true }) resetPasswordForm!: NgForm;
  password: string;
  loading: boolean;

  ngOnInit(): void {
  }

  validatePassword() {
    const pattern =  /^.{8,}$/;
    return (this.resetPasswordForm.controls['password']?.invalid && this.resetPasswordForm.controls['password']?.touched) || !pattern.test(this.resetPasswordForm.form.value.password);
  }

  resetPassword() {
    this.authService.setNewPassword().subscribe({

    });
  }

}
