import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  constructor() { }

  @ViewChild('loginForm') loginForm!: NgForm;

  password: string;
  ngOnInit(): void {}

  onSubmit() {}

}
