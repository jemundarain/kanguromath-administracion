import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  
  constructor() { }
  @Input() category: string;
  categoryOut: string;
  @Output() onChangeCategory: EventEmitter<string> = new EventEmitter();
  categories = GlobalConstants.CATEGORIES;

  ngOnInit(): void {
    this.categoryOut = this.category;
  }

  onSelectionChange() {
    this.onChangeCategory.emit(this.categoryOut);
  }
}
