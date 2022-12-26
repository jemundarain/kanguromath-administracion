import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor() { }

  public rangoFecha: string = 'Últimos 30 días: Enero 21 - Febrero 22, 2022';

  ngOnInit(): void {
  }

}
