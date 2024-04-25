import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { Transaction, TransactionRowComponent } from '../transaction-row/transaction-row.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export interface TransactionsRequestGetBody {
  total: number;
  transactions: Transaction[];
}

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [TransactionRowComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.css']
})

export class AllTransactionsComponent implements DoCheck {
  @Output() transactionsUpdated: EventEmitter<any> = new EventEmitter()
  transactions: Transaction[] | null = JSON.parse(localStorage.getItem('request') || 'null');
  transactionsPaginated?: Transaction[];
  pages: number = 1;
  constructor(private route: ActivatedRoute, private cookieService: CookieService) { }
  isNull: boolean = this.cookieService.get('sessionId') ? false : true;
  page: number = 1

  ngDoCheck(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
    if (this.transactions && this.transactions!.length > 0) {
      this.page = Number(this.route.snapshot.queryParamMap.get('p') || 1)
      this.transactions.forEach(r => r.amount = r.amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      }));
      this.transactionsPaginated = this.transactions.slice((this.page - 1) * 4, this.page * 4)
      this.pages = Math.ceil(this.transactions.length / 4)
    }
  }

  changed() {
    this.transactionsUpdated.emit()
  }
}
