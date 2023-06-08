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
    
    getEditions() {
        return this.http.get<string[]>(`${ this.baseUrl }/admin_tests/get_editions`)
    }

    getLevelsByEdition(edition: string) {
        return this.http.get<string[]>(`${ this.baseUrl }/admin_tests/${edition}/levels`)
    }
    
    getProblemById(_id: string): Observable<Problem> {
        return this.http.get<Problem>(`${ this.baseUrl }/admin_problems/get_problem/${_id}`)
    }

    getProblemsByTestId(test_id: string): Observable<Problem[]> {
        return this.http.get<Problem[]>(`${ this.baseUrl }/admin_problems/get_all_problems_from_test/${test_id}`)
    }

    getTestByProblemId(problem_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`${ this.baseUrl }/admin_tests/get_test_by_problem/${problem_id}`)
    }

    addNewTest(test: Test) {
        return this.http.post<{successful: boolean}>(`${ this.baseUrl }/admin_tests/post_test/`, test);
    }

    uploadNewTest(test: Test) {
        return this.http.post<{message: string}>(`${ this.baseUrl }/admin_uploads/post_test/`, test);
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
    
    addNewProblem(problem: Problem, test_id: string) {
        return this.http.post<Problem>(`${this.baseUrl}/admin_problems/post_problem/${test_id}`, problem);
    }

    addExistingProblem(test_id: string, _id: string) {
        this.http.put<{message: string}>(`${this.baseUrl}/admin_problems/put_existing_problem`, {test_id, _id}).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }
    
    updateProblem(test_id: string, num_s: number, problem: Problem) {
        return this.http.put<{message: string}>(`${this.baseUrl}/admin_problems/put_problem`, {test_id, num_s, problem}).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }

    deleteProblem(test_id: string, _id: string) {
        this.http.delete<{message: string}>(`${this.baseUrl}/admin_problems/delete_problem?test_id=${test_id}&_id=${_id}`).subscribe((jsonData) => {
            console.log(jsonData);
        })       
    }
    
    searchProblem(edition: string, term: string, levels: string): Observable<[]> {
        return this.http.get<[]>(`${this.baseUrl}/admin_problems/search_problems?edition=${edition}&term=${term}&levels=${levels}`);
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

    createFolder(folderName: string, parentFolderPath: string) {
        this.http.get<any>(`${this.baseUrl}/admin_uploads/create-folder?folder-name=${folderName}&parent-folder-path=${parentFolderPath}`).subscribe((data) => {
            console.log(data);
        });
    }

    moveFile(sourceFilePath: string, destinationPath: string) {
        return this.http.post<any>(`${this.baseUrl}/admin_uploads/move-file`, {sourceFilePath, destinationPath});
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