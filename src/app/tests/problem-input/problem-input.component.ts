import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-problem-input',
  templateUrl: './problem-input.component.html'
})
export class ProblemInputComponent implements OnInit {

  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();
  searchTerm: string;

  constructor() { }

  ngOnInit(): void {
    this.debouncer
      .pipe(debounceTime(300))
      .subscribe( searchTerm => this.onDebounce.emit( searchTerm ));
  }
  
  keyPressed() {
    this.debouncer.next( this.searchTerm );
  }
}

