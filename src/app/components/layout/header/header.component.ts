import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, DoCheck, ElementRef, EventEmitter, OnChanges, Output, ViewChild } from '@angular/core';
import { TrasactionsService } from '../../../services/trasactions.service';
import { SearchComponent } from '../../ui/search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SearchComponent
  ],
  providers: [
    TrasactionsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements AfterViewInit, DoCheck {
  @Output() transactionsUpdated: EventEmitter<any> = new EventEmitter()
  @ViewChild('headerButton') headerButton!: ElementRef<HTMLElement>;
  constructor(private tranctionsService: TrasactionsService) { }
  isUnknown: boolean = localStorage.getItem('sessionId') ? false : true

  ngAfterViewInit(): void {
    let headerBtn = this.headerButton.nativeElement
    headerBtn.addEventListener('click', (e) => {
      if (headerBtn.classList.toggle('actived')) {
        document.querySelector('body')!.style.overflowY = 'hidden'
      } else {
        document.querySelector('body')!.style.overflowY = 'auto'
      }
    })
  }

  ngDoCheck(): void {
    this.isUnknown = localStorage.getItem('sessionId') ? false : true
  }

  endSession() {
    if (!this.isUnknown) {
      this.tranctionsService.endSession(localStorage.getItem('sessionId')!).subscribe({
        next: async () => {
          this.cookieService.delete('sessionId');

          let hasSessionId = this.cookieService.get('sessionId') ?? null
          if (!hasSessionId) {
            localStorage.removeItem('request');
            localStorage.removeItem('limitedItems')
            localStorage.removeItem('summary');
            localStorage.removeItem('sessionId')
            location.reload()
          }
        }
      })
    }
  }
  change() {
    this.transactionsUpdated.emit()
  }
}
