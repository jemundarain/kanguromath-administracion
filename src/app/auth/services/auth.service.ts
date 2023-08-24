import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Auth } from '../auth-model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn:"root"})
export class AuthService{

  private baseUrl: string = environment.baseUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router){}
  
  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.setLoggedIn(false); // Token expirado
    } else {
      try {
        const decodedToken: { [key: string]: any } = jwt_decode(token);
        const now = Date.now().valueOf() / 1000; // Fecha actual en segundos
        if (typeof decodedToken['exp'] !== 'undefined' && decodedToken['exp'] < now) {
          this.setLoggedIn(true); // Token expirado
        }
        this.setLoggedIn(true); // Token válido
      } catch (error) {
        this.setLoggedIn(false); // Token inválido
      }
    }
  }

  login(auth: Auth) {
    return this.http.post(`${this.baseUrl}/auth`, auth).pipe(
      map((res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        this.setLoggedIn(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.setLoggedIn(false);
    this.router.navigate(['/auth/iniciar-sesion']);
  }

  sendRecoverEmail(id: string) {
    return this.http.get<any>(`${this.baseUrl}/auth/send_recovery_email/${id}`);
  }

  validateRecoveryToken(app: boolean, token: string) {
    return this.http.get(`${this.baseUrl}/auth/validate_recovery_token/${app}/${token}`);
  }

  setNewPassword(app: boolean, _id: string, password: string) {
    return this.http.put(`${this.baseUrl}/auth/set_new_password`, {app, _id, password});
  }

}