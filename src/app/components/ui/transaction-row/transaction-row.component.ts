import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

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
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.css'
})


export class TransactionRowComponent {
  @Input() transaction!: Transaction;
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
}
