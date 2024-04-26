import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, DoCheck, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UpdateTransactionComponent } from '../update-transaction/update-transaction.component';

export interface Transaction {
  id: string;
  session_id: string;
  title: string;
  amount: string | number;
  type: 'debit' | 'credit';
  category: 'food' | 'travel' | 'clothes' | 'games' | 'job' | 'others';
  created_at: Date
}

@Component({
  selector: 'app-transaction-row',
  standalone: true,
  imports: [UpdateTransactionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.css'
})


export class TransactionRowComponent implements AfterViewInit, DoCheck {
  @Output() transactionsUpdated: EventEmitter<any> = new EventEmitter()
  @ViewChild('popup') popup!: ElementRef<HTMLElement>
  @ViewChild('trion') trion!: ElementRef<HTMLElement>
  @ViewChild('parentPopUp') parentPopUp!: ElementRef<HTMLElement>
  @Input() canOpenModal: boolean = true;

  @Input() transaction!: Transaction;
  transactionToUpdate!: Transaction | null;
  canOpenPopUp: boolean = false;

  icons: {
    [key: string]: {
      icon: string
      color: string;
    }
  } = {
      'food': { icon: 'fluent:food-pizza-20-filled', color: 'border-[#fb5a] text-[#fb5a] bg-[#fb53]' },
      'travel': { icon: 'material-symbols:travel-rounded', color: 'border-[#0f9a] text-[#0f9a] bg-[#0f93]' },
      'clothes': { icon: 'raphael:tshirt', color: 'border-[#8dea] text-[#8dea] bg-[#8de3]' },
      'games': { icon: 'ph:game-controller-fill', color: 'border-[#f8fa] text-[#f8fa] bg-[#f8f3]' },
      'job': { icon: 'material-symbols:work-history-rounded', color: 'border-[#a9d] text-[#a9d] bg-[#a9d3]' },
      'others': { icon: 'mdi:dots-grid', color: 'border-[#ddd9] text-[#ddd9] bg-[#ddd3]' }
    }


  ngDoCheck(): void {
    this.transaction.amount = this.transaction.amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  ngAfterViewInit(): void {
    const popup = this.popup.nativeElement;
    const transaction = this.trion.nativeElement;

    transaction.addEventListener('dblclick', () => {
      this.transactionToUpdate = this.transaction;

      popup.classList.add('actived')
      this.canOpenPopUp = true

      localStorage.setItem('updt-transaction', JSON.stringify(this.transactionToUpdate));
      this.parentPopUp.nativeElement.style.display = 'grid'

      document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape') {
          this.transactionToUpdate = null;
          localStorage.removeItem('updt-transaction');
          this.parentPopUp.nativeElement.style.display = 'none';
          this.canOpenPopUp = false
        }
      })

      popup.addEventListener('click', () => {
        this.transactionToUpdate = null;
        localStorage.removeItem('updt-transaction');
        this.parentPopUp.nativeElement.style.display = 'none';
        this.canOpenPopUp = false
      })
    })
  }

  changed() {
    this.transactionsUpdated.emit()
  }
}