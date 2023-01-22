import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartDataset, DatasetChartOptions } from 'chart.js';
import { DateOption } from '../interfaces/date-option.interfaces';
import { PagesService } from '../services/pages.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from '../interfaces/ranking.interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private pagesService: PagesService, private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder) { }
  
  numberUsers: number;
  dateRange: Date[];
  dates: Date[]
  minDate: Date;
  maxDate: Date;
  dateStart: string;
  dateOption: string;
  dateOptions: DateOption[] = this.setCurrentDatesInLabels(GlobalConstants.DATE_OPTIONS);
  daysBack: number;
  labels: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ]
  datasets: ChartDataset[] = [
    {
      label: "dddd",
      backgroundColor: "#F59E0B",
      borderColor: "#F59E0B",
      data: [65, 78, 66, 44, 56, 67, 75],
      fill: false,
    }
  ]
  @ViewChild('dateFilterForm', { static: true }) dateFilterForm!: NgForm;

  ranking: Ranking[];

  ngOnInit(): void {
    this.maxDate = new Date();
    this.pagesService.getMinimumRegistrationDate().subscribe((data) => {
      this.minDate = new Date(data);
    });
    this.dateFilterForm.form.valueChanges.subscribe((data) => {
      switch (this.dateFilterForm?.form.value.dateOption) {
        case GlobalConstants.DATE_OPTIONS[0].code: //today
          this.daysBack = 0;
        break;
        case GlobalConstants.DATE_OPTIONS[1].code: //yesterday
          this.daysBack = 1;
        break;
        case GlobalConstants.DATE_OPTIONS[2].code: //last-7days
          this.daysBack = 7;
        break;
        case GlobalConstants.DATE_OPTIONS[3].code: //last-30days
          this.daysBack = 30;
        break;
        case GlobalConstants.DATE_OPTIONS[4].code: //customize
        this.pagesService.getNumberUsersByDateRange(data?.dates[0], this.addDays(new Date(data?.dates[1]), 1).toISOString().split('T')[0])
          .subscribe( numberUsers => this.numberUsers = numberUsers );
        break;
        default:
          break;
      }
      if(this.dateFilterForm?.form.value.dateOption != GlobalConstants.DATE_OPTIONS[4].code){
        this.dateStart = this.getDateStringToISO(this.daysBack);
        this.pagesService.getNumberUsersByDateRange(this.dateStart, this.addDays(new Date(), 1).toISOString().split('T')[0])
          .subscribe( numberUsers => this.numberUsers = numberUsers );
      }
    })
    this.pagesService.getRanking().subscribe(ranking => {
      this.ranking = ranking.sort((a, b) => b.count-a.count);
      for(let i=0; i<this.ranking.length; i++) {
        this.ranking[i]._id = this.capitalizeFirstLetters(this.ranking[i]._id.replace('-', ' '));
      }
    });
  }

  capitalizeFirstLetters( word: string ) {
    const arr = word.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
  }

  addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }

  getDateStringToLocale( backDays: number ){
    const month_formatter = new Intl.DateTimeFormat('es', { month: 'long' });
    var date = (new Date(new Date().setDate(new Date().getDate() - backDays )));
    return `desde ${this.capitalizeFirstLetters(month_formatter.format(date))} ${date.getDate()}, ${date.getFullYear()}`
  }

  getDateStringToISO( backDays: number ){
    return (new Date(new Date().setDate(new Date().getDate() - backDays ))).toISOString().split('T')[0];
  }

  setCurrentDatesInLabels( dateOptions: DateOption[] ) {
    for(let i=0; i<dateOptions.length; i++) {
      switch (dateOptions[i].code) {      
        case 'last-7days':
          dateOptions[i].name += ': ' + this.getDateStringToLocale(7);
          break;

        case 'last-30days':
          dateOptions[i].name += ': ' + this.getDateStringToLocale(30);
          break;
      
        default:
          break;
      }
    }
    return dateOptions;
  }
}
