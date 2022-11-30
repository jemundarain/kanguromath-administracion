import { Component, OnInit } from '@angular/core';
interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-list-tests',
  templateUrl: './list-tests.component.html',
  styleUrls: ['./list-tests.component.scss']
})
export class ListTestsComponent implements OnInit {

  public cities: string[] = ['Londres', 'Upata', 'París', 'Guasipati']
  ngOnInit(): void {
  }

}
