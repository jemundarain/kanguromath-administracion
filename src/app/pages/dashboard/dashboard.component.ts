import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DateOption } from '../interfaces/date-option.interfaces';
import { PagesService } from '../services/pages.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private pagesService: PagesService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder) { }
  
  
  public rangoFecha: string = 'Últimos 30 días: Enero 21 - Febrero 22, 2022';
  numberUsers: number;
  dateRange: Date[];
  dates: Date[]
  minDate: Date;
  maxDate: Date;
  dateOption: string = 'customize';
  dateOptions: DateOption[] = [
    {name: 'Ayer', code: 'yesterday'},
    {name: 'Últimos 7 días', code: 'last-7days'},
    {name: 'Últimos 30 días', code: 'last-30days'},
    {name: 'Rango de fecha personalizado', code: 'customize'},
  ]

  ngOnInit(): void {

    this.minDate = new Date("2022-01-01"); //buscar en la api el día que se registró el 1er usuario
    this.maxDate = new Date();
    // this.dateFilterForm.valueChanges.subscribe((data) => {
    //   console.log('data', data);
    //   this.pagesService.getNumberUsersByDateRange("2023-01-01", "2023-01-05")
    //   .subscribe( numberUsers => this.numberUsers = numberUsers);
    // })

  }
}
