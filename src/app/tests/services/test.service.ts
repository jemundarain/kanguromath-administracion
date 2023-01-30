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
    
    private images:object[] = [];
    private url: string = 'https://api.imgur.com/3/image';
    private clientId: string = 'YOUR_CLIENT_ID';
    imageLink:any;

    constructor(private http: HttpClient){}
    
    getTestById(test_id: string): Observable<Test> {
        return this.http.get<Test>(`${ this.baseUrl }/prueba/${test_id}`)
    }
    
    getTestsByEdition(edition: string): Observable<Test[]>{
        return this.http.get<Test[]>(`${ this.baseUrl }/pruebas/${edition}`)
    }
    
    getEditions(): Observable<string[]>{
        return this.http.get<string[]>(`${ this.baseUrl }/ediciones`)
    }
    
    getProblemById(problem_id: string): Observable<Problem> {
        return this.http.get<Problem>(`${ this.baseUrl }/problema/${problem_id}`)
    }

    getTestByProblemId(problem_id: string): Observable<Test[]> {
        return this.http.get<Test[]>(`${ this.baseUrl }/prueba/problema/${problem_id}`)
    }

    uploadImage(imageFile:File, infoObject: ImageInfo){
        let formData = new FormData();
        formData.append('image', imageFile, imageFile.name);
    
        let header = new HttpHeaders({
          "authorization": 'Client-ID '+this.clientId
        });
       
        this.http.post(this.url, formData, {headers:header}).subscribe((imageData: any) => {
            
            this.imageLink = imageData['data'].link;
            
            let newImageObject: ImageInfo = {
                title: infoObject["title"],
                link:this.imageLink
            };
            
            this.images.unshift(newImageObject);
        });
    }

    getImages(){
        return this.images;
    }

    getProblemsByIds(problemsIds: string[]) {
        var arr: Observable<Problem>[] = [];
        for(let i=0; i<problemsIds.length; i++) {
          arr.push(this.getProblemById( problemsIds[i] ))
        }
        //this.problems.sort((a, b) => a.num_s-b.num_s);
        return concat(...arr).pipe(toArray());
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
    

    updateTest(test: Test) {
        this.http.put<{message: string}>(`${this.baseUrl}/prueba/editar/`, test).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }

    deleteTest(_id: string) {
        this.http.delete<{message: string}>(`${this.baseUrl}/prueba/eliminar/${_id}`).subscribe((jsonData) => {
            console.log(jsonData);
        })
    }
}