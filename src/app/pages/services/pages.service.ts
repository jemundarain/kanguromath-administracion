import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concat, forkJoin, map, merge, Observable, of, toArray } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ranking } from '../interfaces/ranking.interfaces';
import { Global } from '../global-model'
import * as dayjs from 'dayjs'
import { DateOption } from '../interfaces/date-option.interfaces';
import { GlobalConstants } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getNumberUsersByDateRangeTotal(start: string, end: string): Observable<number> {
    return this.http.get<number>(`${ this.baseUrl }/usuarios-total?start=${ start }&end=${ dayjs(end).add(1, 'day').clone().format('YYYY-MM-DD') }`)
  }

  getNumberUsersByDateRange(start: string, end: string): Observable<number[]> {
    return this.http.get<number[]>(`${ this.baseUrl }/usuarios?start=${ start }&end=${ end }`)
  }

  getMinimumRegistrationDate() {
    return this.http.get<Date>(`${ this.baseUrl }/usuarios/fecha_minima`)
  }

  getRanking() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/usuarios/ranking`)
  }

  getUsersDistributionByType() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/usuarios/distribution-by-type`)
  }

  getUsersDistributionByLevel() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/usuarios/distribution-by-level`)
  }

  getUsersDistributionBySex() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/usuarios/distribution-by-sex`)
  }

  getUsersDistributionByInstitution() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/usuarios/distribution-by-institution`)
  }

  getAlgebraPerformanceDistribution(start: string, end: string) {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/desempeno-total/algebra?start=${ start }&end=${ end }`)
  }
  
  getAlgebraPerformanceByDateRange(start: string, end: string) {
    return this.http.get<number[][]>(`${ this.baseUrl }/desempeno/algebra?start=${ start }&end=${ end }`)
  }

  getLabelsDateRange(start: string, end: string) {
    var arr = [];
    var startD = dayjs(start);
    var endD = dayjs(end).add(1, 'day');
    while(startD.format('YYYY-MM-DD') != endD.format('YYYY-MM-DD')) {
      arr.push(startD.format('DD-MM-YY'));
      startD = startD.add(1, 'day');
    }
    return arr;
  }
  

  getAppState(): Observable<Global> {
    return this.http.get<Global>(`${ this.baseUrl }/ajustes/estado-app`)
  }

  updateAppState(global: Global) {
    this.http.put<{message: string}>(`${ this.baseUrl }/ajustes/cambiar-estado`, global).subscribe((jsonData) => {
      console.log(jsonData);
    })
  }

  deleteImage(file_id: string) {
    this.http.delete(`${ this.baseUrl }/imagekit-delete/${ file_id }`).subscribe()
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

}
