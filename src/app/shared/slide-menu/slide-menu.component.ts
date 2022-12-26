import { Component, OnInit } from '@angular/core';

import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrls: []
})
export class SlideMenuComponent implements OnInit {

  constructor() { }

  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Informe',
        icon: 'pi pi-th-large',
        routerLink: 'math/informe'
      },
      {
        label: 'Pruebas',
        icon: 'pi pi-file',
        items: [{
          label: 'Todas las Pruebas', 
          icon: 'pi pi-file',
          routerLink: 'pruebas'
        },
        {
          label: 'Prueba Nueva', 
          icon: 'pi pi-plus',
          routerLink: 'pruebas/agregar'
        },
        {
          label: 'Editar Prueba', 
          icon: 'pi pi-pencil',
          routerLink: 'pruebas/editar/222'
        },
        {
          label: 'Editar problema', 
          icon: 'pi pi-pencil',
          routerLink: 'pruebas/editar-problema/222'
        }]
      },
      {
        label: 'Ajustes',
        icon: 'pi pi-cog',
        routerLink: 'math/ajustes'
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        routerLink: ''
      }
    ];
  }

}
