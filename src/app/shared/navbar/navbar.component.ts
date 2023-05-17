import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../auth/services/auth-service';
import { AdminUser } from 'src/app/admin-users/models/adminUser-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
      .pi-bars {
        font-size: 22px !important;
        color: #fff;
        padding: 3px !important;
      }
    `
  ],
  animations: [
    trigger('slidein', [
      transition(':enter', [
        // when ngif has true
        style({ transform: 'translateX(-100%)' }),
        animate(420, style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        // when ngIf has false
        animate(420, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class NavbarComponent {

  @Input() expanded: boolean;
  @Output() onEmitExpanded: EventEmitter<boolean> = new EventEmitter();
  loggedIn: boolean;
  adminUser: AdminUser;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.adminUser = JSON.parse(userStr);
      }
    });  
  }
  
  emitExpanded() {
    this.onEmitExpanded.emit(this.expanded);
  }

  goToProfile() {
    this.router.navigate([`/usuarios/ver/${this.adminUser.username}`]);
  }

  generateSmartCropLink(avatar: string) {
    const [baseUrl, ] = avatar.split('?');
    return `${baseUrl}/tr:w-60,h-60,fo-auto`;
  }

}
