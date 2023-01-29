import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  password: string;
  maxDate: Date = new Date();
  date_birthday: Date;
  profileImg: string;

  constructor() { }

  ngOnInit(): void {
  }

  updateProfile() {

  }
}
