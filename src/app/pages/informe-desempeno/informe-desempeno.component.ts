import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MessageService } from 'primeng/api';
import { GlobalConstants } from 'src/app/common/global-constants';
import { NgForm } from '@angular/forms';
import { DateOption } from '../interfaces/date-option.interfaces';
import { Chart } from 'chart.js/auto';
import { PagesService } from '../services/pages.service';

@Component({
  selector: 'app-informe-desempeno',
  templateUrl: './informe-desempeno.component.html',
  providers: [ MessageService ]
})
export class InformeDesempenoComponent implements OnInit {

  constructor(private pagesService: PagesService,
    private messageService: MessageService) { }

  @ViewChild('dateFilterForm', { static: true }) dateFilterForm!: NgForm;
  @ViewChild('report') report!: ElementRef;

  //Opciones de fecha
  dateOption: string;
  dateOptions: DateOption[] = this.pagesService.setCurrentDatesInLabels(GlobalConstants.DATE_OPTIONS);

  //Calendario
  dates: Date[]
  minDate: Date;
  maxDate: Date = new Date();
  dateStart: string;
  dateEnd: string = dayjs().format('YYYY-MM-DD');


  //Line chart
  algebraData: any;
  geometryData: any;
  probabilityData: any;
  numberTheoryData: any;
  basicOptions = GlobalConstants.BASIC_OPTIONS;
  labels: string[] = [];

  ngOnInit(): void {
    Chart.defaults.font.size = 18;
    Chart.defaults.color = "#26201f";
    Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

    this.dateFilterForm.form.valueChanges.subscribe((data) => {
      this.algebraData = null;
      this.geometryData = null;
      this.probabilityData = null;
      this.numberTheoryData = null;
      switch (this.dateFilterForm?.form.value.dateOption) {
        case GlobalConstants.DATE_OPTIONS[0].code: //beginning
          //this.dateStart = dayjs(this.minDate).format('YYYY-MM-DD');
          this.dateStart = '2023-02-01';
        break;
        case GlobalConstants.DATE_OPTIONS[1].code: //today
          this.dateStart = GlobalConstants.getDateBackString(0);
        break;
        case GlobalConstants.DATE_OPTIONS[2].code: //yesterday
          this.dateStart = GlobalConstants.getDateBackString(1);
        break;
        case GlobalConstants.DATE_OPTIONS[3].code: //last-7days
          this.dateStart = GlobalConstants.getDateBackString(6);
        break;
        case GlobalConstants.DATE_OPTIONS[4].code: //last-30days
          this.dateStart = GlobalConstants.getDateBackString(29);
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
    
      //Line chart
      this.pagesService.getAlgebraPerformanceByDateRange(this.dateStart, this.dateEnd).subscribe((data) => {
        this.algebraData = {
          labels: this.pagesService.getLabelsDateRange(this.dateStart, this.dateEnd),
          datasets: [
            {
              label: 'Respuestas Correctas',
              data: data[0],
              fill: false,
              borderColor: "#44896A",
              tension: 0.1
            },
            {
              label: 'Respuestas Incorrectas',
              data: data[1],
              fill: false,
              borderColor: "#D93661",
              tension: 0.1
            }
          ]
        }
      });
    })
  }

  public downloadInformeDesempeno(): void {
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
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {
        docResult.save(`InformeDesempeño-${dayjs().format('DD-MM-YYYY')}.pdf`);
      });
    }
    this.messageService.add({ severity:'success', summary: 'Reporte descargado' });
  }


}
