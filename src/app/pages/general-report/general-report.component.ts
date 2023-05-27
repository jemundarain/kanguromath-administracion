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
import * as dayjs from 'dayjs'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-informe-general',
  templateUrl: './general-report.component.html',
  providers: [ MessageService ]
})
export class GeneralReportComponent implements OnInit {

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
  dateOptions: DateOption[] = this.pagesService.setCurrentDatesInLabels(GlobalConstants.DATE_OPTIONS);

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
  dateEnd: string = dayjs().format('YYYY-MM-DD');

  daysBack: number;

  ngOnInit(): void {
    Chart.defaults.font.size = 18;
    Chart.defaults.color = "#26201f";
    Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    
    /*Set Usuarios Registrados
    this.pagesService.getMinimumRegistrationDate().subscribe((data) => {
      this.minDate = new Date(data);
    });*/

    this.dateFilterForm.form.valueChanges.subscribe((data) => {
      this.basicData = null;
      switch (this.dateFilterForm?.form.value.dateOption) {
        case GlobalConstants.DATE_OPTIONS[0].code: //today
          this.dateStart = GlobalConstants.getDateBackString(0);
        break;
        case GlobalConstants.DATE_OPTIONS[1].code: //yesterday
          this.dateStart = GlobalConstants.getDateBackString(1);
        break;
        case GlobalConstants.DATE_OPTIONS[2].code: //last-7days
          this.dateStart = GlobalConstants.getDateBackString(6);
        break;
        case GlobalConstants.DATE_OPTIONS[3].code: //last-30days
          this.dateStart = GlobalConstants.getDateBackString(29);
        break;
        case GlobalConstants.DATE_OPTIONS[4].code: //beginning
        //this.dateStart = dayjs(this.minDate).format('YYYY-MM-DD');
          this.dateStart = '2023-02-15';
        break;
        case GlobalConstants.DATE_OPTIONS[5].code: //customize
          if(data?.dates && data?.dates[0] && data?.dates[1]) {
            this.dateStart = data?.dates[0];
            this.dateEnd = data?.dates[1];
          }
        break;
        default:
          break;
      }

      //Usuarios Registrados
      if(this.numberUsers === undefined) {
        this.pagesService.getNumberUsersByDateRangeTotal()
          .subscribe( data => this.numberUsers = data );
      }

      //Line chart
      this.pagesService.getNumberUsersByDateRange(this.dateStart, this.dateEnd).subscribe((data) => {
        this.basicData = {
          labels: this.pagesService.getLabelsDateRange(this.dateStart, this.dateEnd),
          datasets: [{
            label: 'Usuarios',
            data: data,
            fill: true,
            backgroundColor: '#f59e0b',
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

  public downloadInformeGeneral(): void {
    const informe = document.getElementById('report');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    
    if(informe) {
      html2canvas(informe, options).then((canvas) => {
        const img = canvas.toDataURL('image/PNG');
        const bufferX = 15;
        const bufferY = 60;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.setFont("Inter", 'bold');
        doc.setFontSize(28);
        doc.textWithLink(`Informe General ${dayjs().format('DD-MM-YYYY')}`, 300, 55, {url: '', underline: true, align: "center"});
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`InformeGeneral-${dayjs().format('DD-MM-YYYY')}.pdf`);
      });
    }
    this.messageService.add({ severity:'success', summary: 'Reporte descargado ✅' });
  }
  
}
