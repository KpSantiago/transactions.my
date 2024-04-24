import { ChangeDetectionStrategy, Component, DoCheck, Input, OnChanges, OnInit } from '@angular/core';
import { Transaction, TransactionRowComponent } from '../transaction-row/transaction-row.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-latest-transactions',
  standalone: true,
  providers: [CookieService],
  imports: [TransactionRowComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './latest-transactions.component.html',
  styleUrl: './latest-transactions.component.css'
})

export class LatestTransactionsComponent implements DoCheck {
  @Input() sessionEnded?: boolean;
  transactions: Transaction[] | null = JSON.parse(localStorage.getItem('request') || 'null');
  constructor(private cookieService: CookieService) { }
  isNull: boolean = this.cookieService.get('sessionId') ? false : true;


  ngDoCheck(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
    if (this.transactions && !this.sessionEnded) {
      this.transactions = this.transactions.map(r => {
        r.amount = r.amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
        return r
      })
      if (this.transactions.length > 3) {
        this.transactions.length = 3
      }
    }
  }
}
