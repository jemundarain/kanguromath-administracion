import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Test } from '../models/test-model';
import { Problem } from '../models/problem-model';
import { environment } from 'src/environments/environment';

@Injectable({providedIn:'root'})
export class TestService {

    private baseUrl: string = environment.baseUrl;
    
    constructor(private http: HttpClient) { }
    
    getTestById(testId: string) {
        return this.http.get<Test>(`${this.baseUrl}/admin_tests/get_test/${testId}`);
    }
    
    getTestsByEdition(edition: string) {
        return this.http.get<Test[]>(`${this.baseUrl}/admin_tests/get_tests_by_edition/${edition}`);
    }
    
    getEditions() {
        return this.http.get<string[]>(`${this.baseUrl}/admin_tests/get_editions`);
    }

    getLevelsByEdition(edition: string) {
        return this.http.get<string[]>(`${this.baseUrl}/admin_tests/${edition}/levels`);
    }
    
    getProblemById(problemId: string) {
        return this.http.get<Problem>(`${this.baseUrl}/admin_problems/get_problem/${problemId}`);
    }

    getProblemsByTestId(testId: string) {
        return this.http.get<Problem[]>(`${this.baseUrl}/admin_problems/get_all_problems_from_test/${testId}`);
    }

    getTestByProblemId(problemId: string) {
        return this.http.get<Test[]>(`${this.baseUrl}/admin_tests/get_test_by_problem/${problemId}`);
    }

    addNewTest(test: Test) {
        return this.http.post<{successful: boolean, test_id: string}>(`${this.baseUrl}/admin_tests/post_test/`, test);
    }

    updateTest(test: Test) {
        return this.http.put<{message: string}>(`${this.baseUrl}/admin_tests/put_test/`, test);
    }

    uploadFigure(pathFile: string, folderFile: string, nameFile: string) {
        return this.http.post<any>(`${this.baseUrl}/admin_uploads/upload_figure`, {pathFile, folderFile, nameFile});
    }

    uploadFigureOption(pathFile: string, folderFile: string, nameFile: string) {
        return this.http.post<any>(`${this.baseUrl}/admin_uploads/upload_option_figure`, {pathFile, folderFile, nameFile});
    }

    deleteTest(_id: string) {
        return this.http.delete<{successful: boolean}>(`${this.baseUrl}/admin_tests/delete_test/${_id}`);
    }
    
    addNewProblem(problem: Problem, testId: string) {
        return this.http.post<Problem>(`${this.baseUrl}/admin_problems/post_problem/${testId}`, problem);
    }

    addExistingProblem(testId: string, _id: string) {
        return this.http.put<any>(`${this.baseUrl}/admin_problems/put_existing_problem`, {testId, _id});
    }
    
    updateProblem(testId: string, num_s: number, problem: Problem) {
        return this.http.put<{message: string}>(`${this.baseUrl}/admin_problems/put_problem`, {testId, num_s, problem});
    }

    deleteProblem(testId: string, _id: string) {
        return this.http.delete<{message: string}>(`${this.baseUrl}/admin_problems/delete_problem?test_id=${testId}&_id=${_id}`);  
    }
    
    searchProblem(edition: string, term: string, levels: string) {
        return this.http.get<[]>(`${this.baseUrl}/admin_problems/search_problems?edition=${edition}&term=${term}&levels=${levels}`);
    }
    
    authenticationImageKitIO() {
        this.http.get<any>(`${this.baseUrl}/admin_uploads/imagekit_auth`).subscribe((data) => {
            console.log(data);
        });
    }

    deleteImage(ikId: string) {
        return this.http.delete<any>(`${this.baseUrl}/admin_uploads/imagekit_delete/${ikId}`);
    }

    createFolder(folderName: string, parentFolderPath: string) {
        return this.http.get<any>(`${this.baseUrl}/admin_uploads/create_folder?folder_name=${folderName}&parent_folder_path=${parentFolderPath}`);
    }

    moveFile(sourceFilePath: string, destinationPath: string) {
        return this.http.post<any>(`${this.baseUrl}/admin_uploads/move_file`, {sourceFilePath, destinationPath});
    }

    getListFiles(path: string) {
        return this.http.get<any>(`${this.baseUrl}/admin_uploads/list_files?path=${path}`);
    }

    deleteFolder(folderName: string) {
        return this.http.delete<any>(`${this.baseUrl}/admin_uploads/delete_folder/${encodeURIComponent(folderName)}`);
    }

}