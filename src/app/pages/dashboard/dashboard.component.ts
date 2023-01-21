import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DateOption } from '../interfaces/date-option.interfaces';
import { PagesService } from '../services/pages.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { GlobalConstants } from 'src/app/common/global-constants';

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
  dateOptions: DateOption[] = GlobalConstants.DATE_OPTIONS;
  daysBack: number;
  @ViewChild('dateFilterForm', { static: true }) dateFilterForm!: NgForm;

  ngOnInit(): void {
    this.maxDate = new Date();
    this.pagesService.getMinimumRegistrationDate().subscribe((data) => {
      this.minDate = new Date(data);
    });
    this.dateFilterForm.form.valueChanges.subscribe((data) => {
      switch (this.dateFilterForm?.form.value.dateOption) {
        case GlobalConstants.DATE_OPTIONS[0].code: //yesterday
          this.daysBack = 1;
        break;
        case GlobalConstants.DATE_OPTIONS[1].code: //last-7days
          this.daysBack = 7;
        break;
        case GlobalConstants.DATE_OPTIONS[2].code: //last-30days
          this.daysBack = 30;
        break;
        case GlobalConstants.DATE_OPTIONS[3].code: //customize
        this.pagesService.getNumberUsersByDateRange(data?.dates[0], data?.dates[1])
          .subscribe( numberUsers => this.numberUsers = numberUsers );
        break;
        default:
          break;
      }
      if(this.dateFilterForm?.form.value.dateOption != GlobalConstants.DATE_OPTIONS[3].code){
        this.dateStart = (new Date(new Date().setDate(new Date().getDate() - this.daysBack ))).toISOString().split('T')[0];
        this.pagesService.getNumberUsersByDateRange(this.dateStart, new Date().toISOString().split('T')[0])
          .subscribe( numberUsers => this.numberUsers = numberUsers );
      }
    })
  }
}
