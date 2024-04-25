import { Component, DoCheck } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements DoCheck {
  constructor(private cookieService: CookieService) { }
  user: string = '';
  summary: { total: number; amount: number | string } = JSON.parse(localStorage.getItem('summary') || 'null');
  ngDoCheck(): void {
    if (localStorage.getItem('sessionId')) {
      this.user = localStorage.getItem('sessionId')!.split('-').slice(3).toString().replaceAll(',', '-');
    }
    this.summary = JSON.parse(localStorage.getItem('summary') || 'null')
  }
}
