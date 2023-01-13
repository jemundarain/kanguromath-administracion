import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DateRange } from '../interfaces/date-range.interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor() { }
  
  dateRange: DateRange[];
  public rangoFecha: string = 'Últimos 30 días: Enero 21 - Febrero 22, 2022';

  ngOnInit(): void {
    this.dateRange = [
      {name: 'Ayer', code: 'yesterday'},
      {name: 'Últimos 7 días', code: 'last-7days'},
      {name: 'Últimos 30 días', code: 'last-30days'},
      {name: 'Rango de fecha personalizado', code: 'customize'},
    ]
  }

}
