import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { AdminUser } from 'src/app/admin-users/models/adminUser-model';
import { Router } from '@angular/router';
import { Auth } from '../../auth-model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  constructor(private authService: AuthService, private router: Router) { }

  @ViewChild('loginForm', { static: true }) loginForm!: NgForm;

  loading: boolean = false;
  id: string;
  password: string;
  ngOnInit(): void {}

  login() {
    this.loading = true;
    let auth = new Auth(this.loginForm.form.value.id, this.loginForm.form.value.password);
    this.authService.login(auth).subscribe( res => {
      this.router.navigate(['/acm/informe-general']);
      this.loading = false;
    });
  }

  validateId() {
    return this.loginForm.controls['id']?.invalid && this.loginForm.controls['id']?.touched;
  }

  validatePassword() {
    return this.loginForm.controls['password']?.invalid && this.loginForm.controls['password']?.touched;
  }
}