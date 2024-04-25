import { Component, DoCheck, EventEmitter, OnInit, Output } from '@angular/core';
import { Transaction, TransactionRowComponent } from '../transaction-row/transaction-row.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TransactionRowComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit, DoCheck {
  @Output() transactionsUpdated: EventEmitter<any> = new EventEmitter()
  transactions: Transaction[] | null = JSON.parse(localStorage.getItem('request') || 'null');
  searchedItems: Transaction[] | null | undefined = [];
  selectForm!: FormGroup;

  ngOnInit(): void {
    this.selectForm = new FormGroup({
      select: new FormControl('title'),
    })
  }

  ngDoCheck(): void {
    if (JSON.parse(localStorage.getItem('request') || 'null')) {
      this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
    }
  }

  verifySearchedContent() {
    if (this.searchedItems) {
      this.searchedItems = []
    }
  }

  search(e: Event): void {
    let select: 'title' | 'amount' | 'created_at' | 'type' | 'category' = this.selectForm.get('select')?.value
    if (this.transactions && select) {
      const target = e.target as HTMLInputElement;

      this.searchedItems = this.transactions.filter(r => {

        return r[select].toString().replaceAll('R$ ', '').toLowerCase().includes(target.value.toLowerCase())

      })
    }
  }

  changed() {
    this.transactionsUpdated.emit()
  }
}
