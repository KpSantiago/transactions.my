import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, OnChanges, Output, ViewChild } from '@angular/core';
import { TrasactionsService } from '../../../services/trasactions.service';
import { CookieService } from 'ngx-cookie-service';
import { SearchComponent } from '../../ui/search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnChanges {
  @Output() sessionEnded: EventEmitter<boolean> = new EventEmitter()
  @ViewChild('headerButton') headerButton!: ElementRef<HTMLElement>;
  constructor(private cookieService: CookieService, private tranctionsService: TrasactionsService) { }
  isUnknown: boolean = this.cookieService.get('sessionId') ? false : true
  ngOnChanges(): void {
    this.isUnknown = this.cookieService.get('sessionId') ? false : true
  }
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

  endSession() {
    if (!this.isUnknown) {
      this.tranctionsService.endSession().subscribe({
        next: async () => {
          this.cookieService.delete('sessionId');
          
          let hasSessionId = this.cookieService.get('sessionId') ?? null
          if (!hasSessionId) {
            localStorage.removeItem('request');
            localStorage.removeItem('limitedItems')
            localStorage.removeItem('summary');
            location.reload()
          }
        }
      })
    }
  }
}
