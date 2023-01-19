import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private primengConfing: PrimeNGConfig) {}  
  title = 'administrador-canguromath-app';

  ngOnInit() {
    this.primengConfing.ripple = true;
    this.primengConfing.setTranslation({
      monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun", "jul","ago","sep","oct","nov","dic" ],
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      dateFormat: "dd/mm/yy",
  });
  }
}
