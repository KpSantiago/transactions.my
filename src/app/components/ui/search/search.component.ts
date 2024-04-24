import { Component, DoCheck, OnInit } from '@angular/core';
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
  transactions: Transaction[] | null = JSON.parse(localStorage.getItem('request') || 'null');
  searchedItems: Transaction[] | null | undefined = [];
  selectForm!: FormGroup;
  ngOnInit(): void {
    this.selectForm = new FormGroup({
      select: new FormControl('title'),
    })
  }

  ngDoCheck(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
  }

  verifySearchedContent() {
    if (this.searchedItems) {
      this.searchedItems = []
    }
  }
  search(e: Event): void {
    let select: 'title' | 'amount' | 'created_at' | 'type' | 'category' = this.selectForm.get('select')?.value
    if (this.transactions && select) {

      this.transactions = this.transactions.map(t => {
        t.amount = t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return t
      })

      const target = e.target as HTMLInputElement;

      this.searchedItems = this.transactions.filter(r => {

        return r[select].toString().replaceAll('R$ ', '').toLowerCase().includes(target.value.toLowerCase())

      })

    }

  }
}
