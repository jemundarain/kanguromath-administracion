import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concat, forkJoin, map, merge, Observable, of, toArray } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ranking } from '../interfaces/ranking.interfaces';
import { ChartDataset } from 'chart.js';


@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getNumberUsersByDateRange(start: string, end: string): Observable<number> {
    return this.http.get<number>(`${ this.baseUrl }/usuarios?start=${ start }&end=${ end }`)
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

  addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }

  getLabelsDateRange(start: string, end: string) {
    var arr = [];
    var startD = new Date(start);
    var endD = this.addDays(new Date(end), 1);
    const month_formatter = new Intl.DateTimeFormat('es', { month: 'long' });
    while(startD.getTime() != endD.getTime()) {
        arr.push(`${startD.getDate()} ${month_formatter.format(startD)}`);
        startD.setDate(startD.getDate() + 1);
    }
    return arr;
  }

  getDatasetDateRange(start: Date, end: Date ) {
    var arr: Observable<number>[] = [];
    var start_aux = new Date(start);
    var end_aux = new Date(end);
    this.addDays(end_aux, 1);
    while(start_aux.getTime() != end_aux.getTime()) {
      arr.push(this.getNumberUsersByDateRange(start_aux.toISOString().split('T')[0], start_aux.toISOString().split('T')[0]));
      this.addDays(start_aux, 1);
    }
    return concat(...arr).pipe(toArray());
  }

  getAppState(): Observable<boolean> {
    return this.http.get<boolean>(`${ this.baseUrl }/ajustes/estado-app`)
  }

}
