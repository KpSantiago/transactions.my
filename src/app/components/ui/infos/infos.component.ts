import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction, TransactionRowComponent } from '../transaction-row/transaction-row.component';
import { ProfileComponent } from '../profile/profile.component';
import { LatestTransactionsComponent } from '../latest-transactions/latest-transactions.component';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-infos',
  standalone: true,
  imports: [
    TransactionRowComponent,
    ProfileComponent,
    LatestTransactionsComponent,
    CreateTransactionComponent,
    FooterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent {
  @Output() transactionsCreated: EventEmitter<any> = new EventEmitter()
  @Input() transactions!: Transaction[] | null;
  @Input() sessionEnded?: boolean;

  changed() {
    this.transactionsCreated.emit()
  }
}
