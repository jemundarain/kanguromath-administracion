import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Auth } from '../auth-model';
import { environment } from '../../../environments/environment';
import { tap } from "rxjs";

@Injectable({providedIn:"root"})
export class AuthService{

    private baseUrl: string = environment.baseUrl;
    private _auth: Auth | undefined;

    constructor(private http: HttpClient){}

    get auth() {
        return { ...this._auth}
    }

    signUp(){ 

    }

    login() {
        return this.http.get(`${ this.baseUrl }/usuarios-admin/`)
            .pipe(
                tap( auth => this._auth ),
                tap( auth => this._auth ),
            );
    }

    logout() {

    }
    
    signupUser(username: string, password: string){

        const authData: Auth = {username: username, password: password};
        
        this.http.post(`${ this.baseUrl }/auth/registro/`, authData).subscribe(res => {
            console.log(res);
        })
    }
}