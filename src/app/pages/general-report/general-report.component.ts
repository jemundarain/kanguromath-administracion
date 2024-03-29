import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RadioOption } from 'src/app/common/radio-option.interface';
import { PageService } from '../services/page.service';
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

  constructor( private pageService: PageService,
               private messageService: MessageService ) { }
  
  @ViewChild('dateFilterForm', { static: true }) dateFilterForm!: NgForm;
  @ViewChild('report') report!: ElementRef;
  
  //Usuarios Registrados
  numberUsers: number;

  //Opciones de fecha
  dateOption: string;
  dateOptions: RadioOption[] = this.pageService.setCurrentDatesInLabels(GlobalConstants.DATE_OPTIONS);

  //Calendario
  dates: Date[]
  minDate: Date;
  maxDate: Date = new Date();
  dateStart: string;
  dateEnd: string = dayjs().format('YYYY-MM-DD');
  daysBack: number;

  //Line chart
  lineChartData: any;
  lineChartOptions = GlobalConstants.BASIC_OPTIONS;
  labels: string[];
  data: number[];
  
  //Ranking por estados
  ranking: Ranking[];

  //Chart Load
  pieChartForRolLoad: boolean;
  pieChartForLevelLoad: boolean;
  pieChartForInstitutionLoad: boolean;
  pieChartForSexLoad: boolean;

  ngOnInit(): void {
    Chart.defaults.font.size = GlobalConstants.CHART_FONT_SIZE;
    Chart.defaults.color = GlobalConstants.CHART_COLOR;
    Chart.defaults.font.family = GlobalConstants.CHART_FONT_FAMILY;
    
    //Fecha mínima
    this.pageService.getMinimumRegistrationDate().subscribe((data) => {
      this.minDate = new Date(data);
    });
    
    //Ranking
    this.pageService.getRanking().subscribe(ranking => {
      this.ranking = ranking;
    });

    this.dateFilterForm.form.valueChanges.subscribe((data) => {
      this.lineChartData = null;
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
        this.dateStart = dayjs(this.minDate).format('YYYY-MM-DD');
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
      this.pageService.getNumberUsersByDateRangeTotal(this.dateStart, this.dateEnd)
        .subscribe( numberUsers => this.numberUsers = numberUsers );

      //Line chart
      this.pageService.getNumberUsersByDateRange(this.dateStart, this.dateEnd).subscribe((data) => {
        this.lineChartData = {
          labels: this.pageService.getLabelsDateRange(this.dateStart, this.dateEnd),
          datasets: [{
            label: 'Usuarios',
            data: data,
            fill: true,
            backgroundColor: '#525fe1',
            borderColor: '#525fe1',
            tension: 0.1
          }]
        }
      });
    })
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
        doc.setFont('Inter', 'bold');
        doc.setFontSize(28);
        doc.textWithLink(`Informe General ${dayjs().format('DD-MM-YYYY')}`, 300, 55, {url: '', underline: true, align: 'center'});
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`InformeGeneral-${dayjs().format('DD-MM-YYYY')}.pdf`);
      });
    }
    this.messageService.add({ severity:'success', summary: 'Reporte descargado ✅' });
  }
  
}
