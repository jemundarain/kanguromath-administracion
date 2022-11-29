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
        icon: 'pi pi-fw pi-th-large'
      },
      {
        label: 'Pruebas',
        icon: 'pi pi-fw pi-file',
        items: [{
          label: 'Prueba Nueva', 
          icon: 'pi pi-fw pi-plus'
        },
        {
          label: 'Editar Prueba', 
          icon: 'pi pi-fw pi-pencil'
        },
        {
          label: 'Editar problema', 
          icon: 'pi pi-fw pi-cog'
        }]
      },
      {
        label: 'Ajustes'
      },
    ];
  }

}
