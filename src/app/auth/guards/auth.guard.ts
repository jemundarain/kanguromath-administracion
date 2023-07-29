import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ 
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private authService: AuthService, private router: Router){}

  canActivate() {
    this.authService.isTokenValid();
    if(!this.authService.isLoggedIn) {
      this.router.navigate(['auth/iniciar-sesion']);
    }
    return this.authService.isLoggedIn;
  }

}
