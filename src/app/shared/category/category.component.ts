import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {
  
  @Input() category: string;
  @Output() onChangeCategory: EventEmitter<string> = new EventEmitter();
  categoryOut: string;
  categories = GlobalConstants.CATEGORIES;

  constructor() { }

  ngOnInit(): void {
    this.categoryOut = this.category;
  }

  onSelectionChange() {
    this.onChangeCategory.emit(this.categoryOut);
  }
}
