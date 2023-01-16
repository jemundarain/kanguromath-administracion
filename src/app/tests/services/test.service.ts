import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject, Observable } from 'rxjs';

import { Test } from '../test-model';
import { Problem } from '../problem-model';
import { environment } from '../../../environments/environment';

@Injectable({providedIn:'root'})
export class TestService {

    private readonly _apiKey: string = 'f46979c97f7f0a98ddb55645a063494d';
    private baseUrl: string = environment.baseUrl;
    constructor(private http: HttpClient){}
    
    getTestById(test_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`${ this.baseUrl }/prueba/${test_id}`)
    }
    
    getTestsByEdition(edition: string): Observable<Test[]>{
        return this.http.get<Test[]>(`${ this.baseUrl }/pruebas/${edition}`)
    }
    
    getEditions(): Observable<string[]>{
        return this.http.get<string[]>(`${ this.baseUrl }/ediciones`)
    }
    
    getProblemById(problem_id: string): Observable<Problem[]> {
        return this.http.get<Problem[]>(`${ this.baseUrl }/problema/${problem_id}`)
    }

    getTestByProblemId(problem_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`${ this.baseUrl }/prueba/problema/${problem_id}`)
    }

    upload(file: File) {
        const formData = new FormData();

        formData.append('image', file);

        return this.http
            .post('/upload', formData, { params: { key: this._apiKey } })
            .pipe(map((response) => console.log(response)));
    }

    /*getLevelbyId(){
        this.http.get<{niveles: any}>('${ this.baseUrl }/niveles')
        .pipe(map((responseData) => {
            return responseData.niveles.map((levels: string) => {
                return levels
            })
        }))
        .subscribe((updateResponse) => {
            this.levels = updateResponse;
            this.levelSubject.next(this.levels);
        })
    }*/
    

    /*updateTest(id: string, test: Test) {
        this.http.put<{message: string}>('${ this.baseUrl }/pruebas/editar/' + id, test).subscribe((jsonData) => {
          console.log(jsonData);
        //   this.getDiaryEntries();
        })
    }*/

}