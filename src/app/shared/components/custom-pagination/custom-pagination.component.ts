import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss'],
})
export class CustomPaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalRecords!: number;
  @Input() pageSize: number = 25;
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  pageCount!: number;

  get pages(): number[] {
    this.pageCount = Math.ceil(this.totalRecords / this.pageSize);

    let startPage = 1;
    if (this.currentPage > Math.floor(this.maxVisiblePages / 2)) {
      startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    }
    const endPage = Math.min(startPage + this.maxVisiblePages - 1, this.pageCount);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalRecords) {
      this.pageChange.emit(page);
    }
  }

  previousPage() {
    this.setPage(this.currentPage - 1);
  }

  nextPage() {
    this.setPage(this.currentPage + 1);
  }
}
