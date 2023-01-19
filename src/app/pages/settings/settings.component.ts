import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  checked: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
