import { Component } from '@angular/core';
interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html'
})
export class ListTestsComponent {

  cities: City[];

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
