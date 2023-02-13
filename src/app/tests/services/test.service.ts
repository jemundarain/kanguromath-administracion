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

    getProblemsByTestId(test_id: string): Observable<Problem[]> {
        return this.http.get<Problem[]>(`${ this.baseUrl }/problemas/${test_id}`)
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

    updateProblem(problem: Problem) {
        this.http.put<{message: string}>(`${this.baseUrl}/problema/editar/`, problem).subscribe((jsonData) => {
          console.log(jsonData);
        })
    }


    /*function string_to_slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        //str = str.replace(/\{.*\}/, ''); // trim
        //str = str.replace(/\\includegraphics\[.*\]/, '{*1*}'); // trim
        //str = str.replace(/\centerline{\[.*\}/, '{*1*}'); // 
    
        return str;
    }
    var x = String.raw` María dibujó varias figuras en hojas de papel cuadradas e idénticas:
    
    \medskip
    \centerline{\includegraphics[height=17mm]{B_fig/B12-1.eps}}
    
    \smallskip
    ¿Cuántas de estas formas tienen el mismo perímetro que la hoja de papel en que están dibujadas?
    `;
    console.log(string_to_slug(x.replace(/\r?\n|\r/gm,"")));*/

    /*
    function string_to_slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.replace(/\{\*.*\*\}/, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
  
    if(str[str.length-1] === '-') {
      str = str.slice(0,-1);
    }
    if(str[0] === '-') {
      str = str.slice(1);
    }
    return str;
    }
    var x = "María dibujó varias figuras en hojas de papel cuadradas e idénticas: {*1*} ¿Cuántas de estas formas tienen el mismo perímetro que la hoja de papel en que están dibujadas?";
    console.log(string_to_slug(x));
    */
}