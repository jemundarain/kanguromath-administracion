import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styles: [`
    .min-h-95vh {
      min-height: 95vh !important;
    }
  `]
})
export class SlideMenuComponent implements OnInit {

  items: MenuItem[] = [];

  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.items = [
      {
        label: 'Informes',
        icon: 'pi pi-th-large',
        items: [
          {
            label: 'Informe General', 
            icon: 'pi pi-file',
            routerLink: 'acm/informe-general'
          },
          {
            label: 'Informe de Desempeño', 
            icon: 'pi pi-file',
            routerLink: 'acm/informe-desempeno'
          }
        ]
      },
      {
        label: 'Pruebas',
        icon: 'pi pi-file',
        items: [{
          label: 'Todas las Pruebas', 
          icon: 'pi pi-file',
          routerLink: 'pruebas/lista'
        },
        {
          label: 'Prueba Nueva', 
          icon: 'pi pi-plus',
          routerLink: 'pruebas/agregar'
        }]
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        items: [{
          label: 'Todas los Usuarios', 
          icon: 'pi pi-file',
          routerLink: 'usuarios/lista'
        },
        {
          label: 'Usuario nuevo', 
          icon: 'pi pi-plus',
          routerLink: 'usuarios/agregar'
        }]
      },
      {
        label: 'Ajustes',
        icon: 'pi pi-cog',
        routerLink: 'acm/ajustes'
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => { this.authService.logout(); }
      }
    ];
  }
}
