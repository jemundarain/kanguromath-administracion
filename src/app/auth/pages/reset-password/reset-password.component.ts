import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  @ViewChild('resetPasswordForm', { static: true }) resetPasswordForm!: NgForm;
  password: string;
  loading: boolean;

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({ token }) => {
        return this.authService.validateRecoveryToken(token);
      })
    ).subscribe( res => {
      console.log("🚀 ~ file: reset-password.component.ts:28 ~ ResetPasswordComponent ~ ngOnInit ~ res:", res)
    });
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
