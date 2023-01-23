import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ranking } from '../interfaces/ranking.interfaces';
import { ChartDataset } from 'chart.js';


@Injectable({
  providedIn: 'root'
})
export class PagesService {

  private baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient){}

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

}
