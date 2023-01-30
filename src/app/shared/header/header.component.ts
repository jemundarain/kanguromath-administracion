import { Component, Input, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  
  @Input() breadcrumbs: MenuItem[];
  @Input() title: string = '';

}
