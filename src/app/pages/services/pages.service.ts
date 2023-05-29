import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ranking } from '../interfaces/ranking.interfaces';
import { Global } from '../global-model'
import * as dayjs from 'dayjs'
import { RadioOption } from 'src/app/common/radio-option.interface';
import { GlobalConstants } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getNumberUsersByDateRangeTotal(start: string, end: string): Observable<number> {
    return this.http.get<number>(`${ this.baseUrl }/admin_users/get_total?start=${ start }&end=${ dayjs(end).add(1, 'day').clone().format('YYYY-MM-DD') }`);
  }

  getNumberUsersByDateRange(start: string, end: string): Observable<number[]> {
    return this.http.get<number[]>(`${ this.baseUrl }/admin_users/get_distribution?start=${ start }&end=${ end }`)
  }

  getMinimumRegistrationDate() {
    return this.http.get<Date>(`${ this.baseUrl }/admin_users/get_minimum_date`)
  }

  getRanking() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/admin_users/get_ranking`)
  }

  getUsersDistributionByType() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/admin_users/get_distribution_by_type`)
  }

  getUsersDistributionByLevel() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/admin_users/get_distribution_by_level`)
  }

  getUsersDistributionBySex() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/admin_users/get_distribution_by_sex`)
  }

  getUsersDistributionByInstitution() {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/admin_users/get_distribution_by_type_institution`)
  }

  getAlgebraPerformanceDistribution(start: string, end: string) {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/performance/algebra?start=${ start }&end=${ end }`)
  }
  
  getCombinatoricsPerformanceDistribution(start: string, end: string) {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/performance/combinatoria?start=${ start }&end=${ end }`)
  }
  
  getNumberTheoryPerformanceDistribution(start: string, end: string) {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/performance/teoria-numeros?start=${ start }&end=${ end }`)
  }

  getGeometryPerformanceDistribution(start: string, end: string) {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/performance/geometria?start=${ start }&end=${ end }`)
  }

  getGlobalPerformanceDistribution(start: string, end: string) {
    return this.http.get<Ranking[]>(`${ this.baseUrl }/performance/global?start=${ start }&end=${ end }`)
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
    return this.http.get<Global>(`${ this.baseUrl }/settings/app-state`)
  }

  updateAppState(global: Global) {
    this.http.put<{message: string}>(`${ this.baseUrl }/settings/change-state`, global).subscribe((jsonData) => {
      console.log(jsonData);
    })
  }

  deleteImage(file_id: string) {
    this.http.delete(`${ this.baseUrl }/imagekit-delete/${ file_id }`).subscribe()
  }

  setCurrentDatesInLabels( dateOptions: RadioOption[] ) {
    for(let i=0; i<dateOptions.length; i++) {
      switch (dateOptions[i].code) {      
        case 'last-7days':
          dateOptions[i].name = dateOptions[i].name.replace('FECHA_INICIO', GlobalConstants.getDateStringToLocale(6));
          break;

        case 'last-30days':
          dateOptions[i].name = dateOptions[i].name.replace('FECHA_INICIO', GlobalConstants.getDateStringToLocale(31));
          break;
      
        default:
          break;
      }
    }
    return dateOptions;
  }

}
