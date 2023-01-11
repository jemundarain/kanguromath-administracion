import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject, Observable } from 'rxjs';

import { Test } from '../test-model';
import { Problem } from '../problem-model';

@Injectable({providedIn:'root'})
export class TestService {

    constructor(private http: HttpClient){}

    /*updateEntry(id: string, entry: DiaryEntry) {
      this.http.put<{message: string}>('http://localhost:3000/update-entry/' + id, entry).subscribe((jsonData) => {
        console.log(jsonData.message);
        this.gettests();
      })
    }*/
    
    public testsSubject = new Subject<Test[]>();
    private tests: Test[] = [];
    public testSubject = new Subject<Test>();
    private test: Test = { test_id: '', levels: '', edition: '', problems: ['']};

    public editionSubject = new Subject<string[]>();
    private editions: string[] = [''];

    public levelSubject = new Subject<string[]>();
    private levels: string[] = [''];

    public problemSubject = new Subject<Problem>();
    private problem: Problem;

    /*onDeleteEntry(id: string){
        
        this.http.delete<{message: string}>('http://localhost:3000/remove-entry/' + id).subscribe((jsonData) => {
        console.log(jsonData.message);
        this.gettests();
        })
    }*/

    getTestById(test_id: string): Observable<Test> {
        return this.http.get<Test>('http://localhost:3000/prueba/' + test_id)
    }

    // getTestById(test_id: string) {
    //     this.http.get<{prueba: any}>('http://localhost:3000/prueba/' + test_id)
    //     .pipe(map((responseData) => {
    //         return responseData.prueba.map((test: {test_id: string; levels: string; edition: string; problems: string[]}) => {
    //             return {
    //                 test_id: test.test_id,
    //                 levels: test.levels,
    //                 edition: test.edition,
    //                 problems: test.problems
    //             }
    //         })
    //     }))
    //     .subscribe((updateResponse) => {
    //         this.test = updateResponse;
    //         this.testSubject.next(this.test);
    //     })
    // }

    getTestsByEdition(edition: string){
        this.http.get<{pruebas: any}>('http://localhost:3000/pruebas/' + edition)
        .pipe(map((responseData) => {
            return responseData.pruebas.map((test: {test_id: string; levels: string; edition: string; problems: string[]}) => {
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
            this.testsSubject.next(this.tests);
        })
    }

    getEditions(){
        this.http.get<{ediciones: any}>('http://localhost:3000/ediciones')
        .pipe(map((responseData) => {
            return responseData.ediciones.map((edition: string) => {
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
            return responseData.niveles.map((levels: string) => {
                return levels
            })
        }))
        .subscribe((updateResponse) => {
            this.levels = updateResponse;
            this.levelSubject.next(this.levels);
        })
    }

    getProblemById(problem_id: string) {
        this.http.get<{problema: any}>('http://localhost:3000/problema/' + problem_id)
        .pipe(map((responseData) => {
            console.log(responseData);
            return responseData.problema.map((problem: {num_s: string; problem_id: string; statement: string; solution: string; type:string; category: string}) => {
                return {
                    num_s: problem.num_s,
                    problem_id: problem.problem_id,
                    statement: problem.statement,
                    solution: problem.solution,
                    type: problem.type,
                    category: problem.category
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.problem = updateResponse;
            this.problemSubject.next(this.problem);
        })
    }

    updateTest(id: string, test: Test) {
        this.http.put<{message: string}>('http://localhost:3000/pruebas/editar/' + id, test).subscribe((jsonData) => {
          console.log(jsonData);
        //   this.getDiaryEntries();
        })
    }

}