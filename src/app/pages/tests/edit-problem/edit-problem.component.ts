import { Component, OnInit } from '@angular/core';
interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-edit-problem',
  templateUrl: './edit-problem.component.html',
  styleUrls: ['./edit-problem.component.scss']
})
export class EditProblemComponent implements OnInit {

  constructor() { }
  selectedValue: string = 'val1';
  value1: number = 0;
  min: number = 0;
  max: number = 10;
  property: string = '';
  ngOnInit(): void {
  }

  selectedCity: City = {
    name: "",
    code: ""
  };

  cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];

}
