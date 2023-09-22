import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit, OnChanges {
  
  @Input() category: string;
  @Output() onChangeCategory: EventEmitter<string> = new EventEmitter();
  categoryOut: string;
  categories = GlobalConstants.CATEGORIES;

  constructor() { }

  ngOnInit(): void {
    this.categoryOut = this.category;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category']) {
      this.categoryOut = this.category;
    }
  }
  

  onSelectionChange() {
    this.onChangeCategory.emit(this.categoryOut);
  }
}
