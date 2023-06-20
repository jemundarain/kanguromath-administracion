import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth-service';
import { Auth } from '../../auth-model';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;

  loading: boolean = false;
  id: string;
  password: string;
  ngOnInit(): void {}

  login() {
    this.loading = true;
    let auth = new Auth(this.loginForm.form.value.id, this.loginForm.form.value.password);
    this.authService.login(auth).subscribe({
      next: (res) => {
        this.router.navigate(['/acm/informe-general']);
      },
      error: () => {
        this.messageService.add({severity:'error', summary: 'Rechazado', detail: 'Email/usuario o contraseña incorrectos', life: 3250});
        this.loading = false;
      }
    });
  }

  validateId() {
    return this.loginForm.controls['id']?.invalid && this.loginForm.controls['id']?.touched;
  }

  validatePassword() {
    return this.loginForm.controls['password']?.invalid && this.loginForm.controls['password']?.touched;
  }
}