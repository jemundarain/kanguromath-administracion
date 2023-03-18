import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concat, map, Observable, toArray } from 'rxjs';

import { Test } from '../models/test-model';
import { Problem } from '../models/problem-model';
import { environment } from 'src/environments/environment';
import { ImageInfo } from '../interfaces/image-info.interface';

@Injectable({providedIn:'root'})
export class TestService {

    private baseUrl: string = environment.baseUrl;
    
    constructor(private http: HttpClient){}
    
    getTestById(test_id: string): Observable<Test> {
        return this.http.get<Test>(`${ this.baseUrl }/admin_tests/get_test/${test_id}`)
    }
    
    getTestsByEdition(edition: string): Observable<Test[]>{
        return this.http.get<Test[]>(`${ this.baseUrl }/admin_tests/get_tests_by_edition/${edition}`)
    }
    
    getEditions(): Observable<string[]>{
        return this.http.get<string[]>(`${ this.baseUrl }/admin_tests/get_editions`)
    }
    
    getProblemById(problem_id: string): Observable<Problem> {
        return this.http.get<Problem>(`${ this.baseUrl }/admin_problems/get_problem/${problem_id}`)
    }

    getProblemsByTestId(test_id: string): Observable<Problem[]> {
        return this.http.get<Problem[]>(`${ this.baseUrl }/admin_problems/get_all_problems_from_test/${test_id}`)
    }

    getTestByProblemId(problem_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`${ this.baseUrl }/admin_tests/get_test_by_problem/${problem_id}`)
    }

    updateTest(test: Test) {
        this.http.put<{message: string}>(`${this.baseUrl}/admin_tests/put_test/`, test).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }

    deleteTest(_id: string) {
        this.http.delete<{message: string}>(`${this.baseUrl}/admin_tests/delete_test/${_id}`).subscribe((jsonData) => {
            console.log(jsonData);
        })
    }

    addProblem(problem: Problem) {
        this.http.post<{message: string}>(`${this.baseUrl}/admin_problems/post_problem`, problem).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }

    updateProblem(problem: Problem) {
        this.http.put<{message: string}>(`${this.baseUrl}/admin_problems/put_problem`, problem).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }

    deleteProblem(_id: string) {
        this.http.delete<{message: string}>(`${this.baseUrl}/admin_problems/delete_problem/${_id}`).subscribe((jsonData) => {
            console.log(jsonData);
        })       
    }

    authenticationImageKitIO() {
        this.http.get<any>(`${this.baseUrl}/admin_uploads/imagekit-auth`).subscribe((data) => {
            console.log(data);
        });
    }

    updateFigure(newFigure: any) {
        this.http.put<any>(`${this.baseUrl}/admin_uploads/put_figure`, newFigure).subscribe((data) => {
            console.log(data);
        });
    }

    deleteFigure(ik_id: string) {
        this.http.delete<any>(`${this.baseUrl}/admin_uploads/imagekit-delete/${ik_id}`).subscribe((data) => {
            console.log(data);
        });
    }

    uploadTest(ik_id: string) {
        this.http.delete<any>(`${this.baseUrl}/admin_uploads/upload-test/${ik_id}`).subscribe((data) => {
            console.log(data);
        });
    }

    // renameFigure(filePath: string, newFileName: string) {
    //     this.http.put<any>(`${this.baseUrl}/admin_uploads/imagekit-rename`, { filePath: filePath, newFileName: newFileName }).subscribe((data) => {
    //         console.log(data);
    //     })
    // }

    // deleteCache(problem_id: string, num_s: number) {
    //     this.http.delete<any>(`${this.baseUrl}/admin_uploads/delete_cache/${problem_id}/${num_s}`).subscribe((data) => {
    //         console.log(data);
    //     });
    // }

}