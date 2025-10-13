import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  @Input() searchTerm: string = '';
  @Input() categories: string[] = [];
  @Input() selectedCategory: string = 'Todos';
  @Input() placeholder: string = 'Search service...';

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() categorySelect = new EventEmitter<string>();

  onSearchChange() {
    this.searchTermChange.emit(this.searchTerm);
  }

  selectCategory(category: string) {
    this.categorySelect.emit(category);
  }
}
