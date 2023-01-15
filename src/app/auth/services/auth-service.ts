import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthModel } from "../auth-model";
import { environment } from '../../../environments/environment';

@Injectable({providedIn:"root"})
export class AuthService{

    private baseUrl: string = environment.baseUrl;

    constructor(private http: HttpClient){}
    
    signupUser(username: string, password: string){

        const authData: AuthModel = {username: username, password: password};
        
        this.http.post(`${ this.baseUrl }/auth/registro/`, authData).subscribe(res => {
            console.log(res);
        })
    }
}