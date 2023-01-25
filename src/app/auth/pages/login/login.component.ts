import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  constructor(private authService: AuthService) { }

  @ViewChild('loginForm') loginForm!: NgForm;

  password: string;
  ngOnInit(): void {}

  login() {
    this.authService.login()
      .subscribe( resp => {
        console.log(resp);
      })
  }

}
