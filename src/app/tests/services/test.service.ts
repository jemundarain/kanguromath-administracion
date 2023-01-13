import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject, Observable } from 'rxjs';

import { Test } from '../test-model';
import { Problem } from '../problem-model';

@Injectable({providedIn:'root'})
export class TestService {

    constructor(private http: HttpClient){}

    getTestById(test_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`http://localhost:3000/prueba/${test_id}`)
    }

    getTestsByEdition(edition: string): Observable<Test[]>{
        return this.http.get<Test[]>(`http://localhost:3000/pruebas/${edition}`)
    }

    getEditions(): Observable<string[]>{
        return this.http.get<string[]>('http://localhost:3000/ediciones')
    }
    
    getProblemById(problem_id: string): Observable<Problem[]> {
        return this.http.get<Problem[]>(`http://localhost:3000/problema/${problem_id}`)
    }

    getTestByProblemId(problem_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`http://localhost:3000/prueba/problema/${problem_id}`)
    }

    /*getLevelbyId(){
        this.http.get<{niveles: any}>('http://localhost:3000/niveles')
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
        this.http.put<{message: string}>('http://localhost:3000/pruebas/editar/' + id, test).subscribe((jsonData) => {
          console.log(jsonData);
        //   this.getDiaryEntries();
        })
    }*/

}