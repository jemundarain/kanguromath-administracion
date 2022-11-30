import { Component } from '@angular/core';
interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html',
  styleUrls: ['./new-test.component.scss']
})
export class NewTestComponent {
  cities: City[];
  value1: number = 0;
  min: number = 0;
  max: number = 10;

  selectedCity: City = {
    name: "",
    code: ""
  };

  constructor() {
      this.cities = [
          {name: 'New York', code: 'NY'},
          {name: 'Rome', code: 'RM'},
          {name: 'London', code: 'LDN'},
          {name: 'Istanbul', code: 'IST'},
          {name: 'Paris', code: 'PRS'}
      ];
  }
}
