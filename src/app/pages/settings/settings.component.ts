import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  val: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
