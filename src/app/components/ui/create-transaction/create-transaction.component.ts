import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrasactionsService } from '../../../services/trasactions.service';
import { Transaction } from '../transaction-row/transaction-row.component';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  providers: [
    TrasactionsService
  ],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css'
})

export class CreateTransactionComponent implements OnInit {
  @Output() transactionsCreated: EventEmitter<any> = new EventEmitter()
  @ViewChild('formDir') formDir!: NgForm

  transactionsForm!: FormGroup
  isLoad: boolean = false;

  constructor(private fb: FormBuilder, private transactionsService: TrasactionsService) { }

  ngOnInit(): void {
    this.transactionsForm = this.fb.group({
      title: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      type: ['', [Validators.required]],
    })
  }

  async onSubmit() {
    if (this.transactionsForm.invalid) {
      setTimeout(() => { this.formDir.resetForm(); this.isLoad = false }, 3000)

      return;
    }

    let number = this.transactionsForm.value.amount.toString().replaceAll(' ', '').replaceAll('.', '').replaceAll('R$', '').replace(',', '.').replace('-', '').replace('+', '')

    let amount = parseFloat(number);

    amount = this.transactionsForm.value.type == 'debit' ? amount * -1 : amount;

    if (isNaN(amount)) {
      this.transactionsForm.setErrors(Validators.requiredTrue)
      return;
    }
    let data: Transaction = { ...this.transactionsForm.value, amount };

    this.isLoad = true
    let sessionId = localStorage.getItem('sessionId');

    // this.transactionsService.post(data, sessionId ? sessionId : undefined).subscribe({
    //   next: (r) => {
    //     if (r) {
    //       localStorage.setItem('sessionId', r.sessionId)
    //     }
    //     localStorage.removeItem('request');
    //     localStorage.removeItem('limitedItems');
    //     localStorage.removeItem('summary');
    //   },
    //   error: () => { },
    //   complete: () => {
    //     this.formDir.resetForm()
    //     this.isLoad = false;
    //     this.transactionsCreated.emit()
    //   }
    // })

  }

}
