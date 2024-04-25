import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Output } from '@angular/core';
import { Transaction, TransactionRowComponent } from '../transaction-row/transaction-row.component';

@Component({
  selector: 'app-latest-transactions',
  standalone: true,
  imports: [TransactionRowComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './latest-transactions.component.html',
  styleUrl: './latest-transactions.component.css'
})

export class LatestTransactionsComponent implements DoCheck {
  @Output() transactionsUpdated: EventEmitter<any> = new EventEmitter()
  transactions: Transaction[] | null = JSON.parse(localStorage.getItem('request') || 'null');
  constructor() { }

  ngDoCheck(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
    if (this.transactions && this.transactions!.length > 0) {
      if (this.transactions.length > 3) {
        this.transactions.length = 3
      }
    }
  }

  changed() {
    this.transactionsUpdated.emit()
  }
}
