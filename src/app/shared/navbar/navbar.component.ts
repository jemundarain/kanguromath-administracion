import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth-service';
import { AdminUser } from 'src/app/admin-users/models/adminUser-model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent {

  @Input() expanded: boolean;
  @Output() onEmitExpanded: EventEmitter<boolean> = new EventEmitter();
  loggedIn: boolean;
  adminUser: AdminUser;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.adminUser = JSON.parse(userStr);
      }
    });  
  }
  
  goToProfile() {
    this.router.navigate([`/usuarios/ver/${this.adminUser.username}`]);
  }

  generateSmartCropLink(avatar: string) {
    const [baseUrl, ] = avatar.split('?');
    return `${baseUrl}/tr:w-60,h-60,fo-auto`;
  }
}
