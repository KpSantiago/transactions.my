import { CommonModule } from '@angular/common';
import { Component, OnChanges, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, DoCheck } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})

export class PaginationComponent implements OnChanges {
  @Input() page: number = 1;
  @Input() pages: number = 1;
  isDisabled: boolean = false;
  isDisabledNext: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnChanges(): void {
    this.page = Number(this.route.snapshot.queryParamMap.get('p') || '1');
    if (this.page > this.pages) this.last();
    if (this.page < 1) this.first();
    this.isDisabled = this.page == 1 ? true : false;
    this.isDisabledNext = this.page == this.pages ? true : false;
  }

  first(): void {
    this.isDisabledNext = false;
    this.isDisabled = true;
    this.router.navigate([''], {
      queryParams: {
        p: 1
      }
    })
  }
  previous(): void {
    let prevPage = this.page - 1
    if (prevPage <= 0) return;
    this.isDisabledNext = false;
    this.isDisabled = prevPage == 1 ? true : false;
    this.router.navigate([''], {
      queryParams: {
        p: prevPage
      }
    })
  }
  next(): void {
    let nextPage = this.page + 1;
    if (nextPage > this.pages) return;
    this.isDisabled = false
    this.isDisabledNext = nextPage == this.pages ? true : false;
    this.router.navigate([''], {
      queryParams: {
        p: nextPage
      }
    })

  }

  last() {
    this.isDisabled = false;
    this.isDisabledNext = true;
    this.router.navigate([''], {
      queryParams: {
        p: this.pages
      }
    })

  }
}
