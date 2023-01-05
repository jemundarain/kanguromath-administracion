import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';

import { Test } from '../test-model';

@Injectable({providedIn:'root'})
export class TestService {

    constructor(private http: HttpClient){}

    /*updateEntry(id: string, entry: DiaryEntry) {
      this.http.put<{message: string}>('http://localhost:3000/update-entry/' + id, entry).subscribe((jsonData) => {
        console.log(jsonData.message);
        this.gettests();
      })
    }*/
    
    public testSubject = new Subject<Test[]>();
    private tests: Test[] = [];

    public editionSubject = new Subject<string[]>();
    private editions: string[] = [''];

    public levelSubject = new Subject<string[]>();
    private levels: string[] = [''];

    /*onDeleteEntry(id: string){
        
        this.http.delete<{message: string}>('http://localhost:3000/remove-entry/' + id).subscribe((jsonData) => {
        console.log(jsonData.message);
        this.gettests();
        })
    }*/

    getTests(){
        this.http.get<{pruebas: any}>('http://localhost:3000/pruebas')
        .pipe(map((responseData) => {
            return responseData.pruebas.map((test: {test_id: string; levels: string[]; edition: string; problems: string[]}) => {
                return {
                    test_id: test.test_id,
                    levels: test.levels,
                    edition: test.edition,
                    problems: test.problems
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.tests = updateResponse;
            this.testSubject.next(this.tests);
        })
    }

    getEditions(){
        this.http.get<{ediciones: any}>('http://localhost:3000/ediciones')
        .pipe(map((responseData) => {
            return responseData.ediciones.map((edition: string[]) => {
                return edition
            })
        }))
        .subscribe((updateResponse) => {
            this.editions = updateResponse;
            this.editionSubject.next(this.editions);
        })
    }

    getLevelbyId(){
        this.http.get<{niveles: any}>('http://localhost:3000/niveles')
        .pipe(map((responseData) => {
            return responseData.niveles.map((levels: string[]) => {
                return levels
            })
        }))
        .subscribe((updateResponse) => {
            this.levels = updateResponse;
            this.levelSubject.next(this.levels);
        })
    }

    /*getDiaryEntry(id: string){
        const index = this.tests.findIndex(el => {
            return el.id == id;
        })
        return this.tests[index];
    }*/

    /*onAddDiaryEntry(diaryEntry: DiaryEntry){
     this.http.post<{message: string}>('http://localhost:3000/add-entry', diaryEntry).subscribe((jsonData) => {
                console.log(diaryEntry);
                this.gettests();
            })
    }*/
}