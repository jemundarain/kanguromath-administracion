import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartDataset, DatasetChartOptions } from 'chart.js';
import { DateOption } from '../interfaces/date-option.interfaces';
import { PagesService } from '../services/pages.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Ranking } from '../interfaces/ranking.interfaces';
import { Chart } from 'chart.js/auto';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [ MessageService ]
})
export class DashboardComponent implements OnInit {

  constructor( private pagesService: PagesService,
               private messageService: MessageService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }
  
  @ViewChild('dateFilterForm', { static: true }) dateFilterForm!: NgForm;
  @ViewChild('report') report!: ElementRef;
  
  //Usuarios Registrados
  numberUsers: number;

  //Opciones de fecha
  dateOption: string;
  dateOptions: DateOption[] = this.setCurrentDatesInLabels(GlobalConstants.DATE_OPTIONS);

  //Calendario
  dates: Date[]
  minDate: Date;
  maxDate: Date = new Date();

  //Line chart
  basicData: any;
  basicOptions = GlobalConstants.BASIC_OPTIONS;
  labels: string[] = [];
  data: number[];
  
  //Ranking por estados
  ranking: Ranking[];
  dateStart: string;
  dateEnd: string = new Date().toISOString().split('T')[0];

  daysBack: number;

  ngOnInit(): void {
    Chart.defaults.font.size = 16;
    Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    /*Set Usuarios Registrados*/
    this.pagesService.getMinimumRegistrationDate().subscribe((data) => {
      this.minDate = new Date(data);
    });

    this.dateFilterForm.form.valueChanges.subscribe((data) => {
      this.basicData = null;
      switch (this.dateFilterForm?.form.value.dateOption) {
        case GlobalConstants.DATE_OPTIONS[0].code: //today
          this.dateStart = GlobalConstants.getDateStringToISO(0);
        break;
        case GlobalConstants.DATE_OPTIONS[1].code: //yesterday
          this.dateStart = GlobalConstants.getDateStringToISO(1);
        break;
        case GlobalConstants.DATE_OPTIONS[2].code: //last-7days
          this.dateStart = GlobalConstants.getDateStringToISO(5);
        break;
        case GlobalConstants.DATE_OPTIONS[3].code: //last-30days
          this.dateStart = GlobalConstants.getDateStringToISO(30);
        break;
        case GlobalConstants.DATE_OPTIONS[4].code: //customize
          if(data?.dates && data?.dates[0] && data?.dates[1]) {
            this.dateStart = data?.dates[0];
            this.dateEnd = data?.dates[1];
          }
        break;
        default:
          break;
      }
      
      let dateStartD = new Date(this.dateStart);
      if(this.dateFilterForm?.form.value.dateOption != GlobalConstants.DATE_OPTIONS[4].code) {
        var dateEndD = new Date();
        GlobalConstants.addDays(dateEndD, 1);
        this.dateEnd = dateEndD.toISOString().split('T')[0];
        GlobalConstants.addDays(dateStartD, -1);
      }
      var dateEndD = new Date(this.dateEnd);

      //Usuarios Registrados
      this.pagesService.getNumberUsersByDateRange(dateStartD.toISOString().split('T')[0], this.dateEnd)
        .subscribe( numberUsers => this.numberUsers = numberUsers );
      
      //Line chart
      this.pagesService.getDatasetDateRange(dateStartD, dateEndD).subscribe((data) => {
        this.basicData = {
          labels: this.pagesService.getLabelsDateRange(this.dateStart, this.dateEnd),
          datasets: [{
            label: 'Usuarios',
            data: data,
            fill: false,
            borderColor: '#f59e0b',
            tension: 0.1
          }]
        }
      });
    })

    /*Ordenamiento de mayor a menor del ranking*/
    this.pagesService.getRanking().subscribe(ranking => {
      this.ranking = ranking.sort((a, b) => b.count-a.count);
    });
  }


  setCurrentDatesInLabels( dateOptions: DateOption[] ) {
    for(let i=0; i<dateOptions.length; i++) {
      switch (dateOptions[i].code) {      
        case 'last-7days':
          dateOptions[i].name += ': ' + GlobalConstants.getDateStringToLocale(6);
          break;

        case 'last-30days':
          dateOptions[i].name += ': ' + GlobalConstants.getDateStringToLocale(31);
          break;
      
        default:
          break;
      }
    }
    return dateOptions;
  }

  public openPDF(): void {
    const DATA = document.getElementById('report');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    if(DATA) {
      html2canvas(DATA, options).then((canvas) => {

        const img = canvas.toDataURL('image/PNG');

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      });
    }
    this.messageService.add({ severity:'success', summary: 'Reporte descargado' });
  }
}
