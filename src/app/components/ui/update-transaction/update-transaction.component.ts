import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrasactionsService } from '../../../services/trasactions.service';
import { Transaction } from '../transaction-row/transaction-row.component';

@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  providers: [
    TrasactionsService
  ],
  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.css'
})

export class UpdateTransactionComponent implements OnInit {
  @Output() transactionsUpdated: EventEmitter<any> = new EventEmitter()
  @ViewChild('formDir') formDir!: NgForm
  transactionToUpdate!: Transaction | null;
  transactionsUpdateForm!: FormGroup;
  isLoad: boolean = false;

  constructor(private fb: FormBuilder, private transactionsService: TrasactionsService) { }

  ngOnInit(): void {
    this.transactionToUpdate = JSON.parse(localStorage.getItem('updt-transaction') || 'null')
    this.transactionsUpdateForm = this.fb.group({
      title: [this.transactionToUpdate?.title ? this.transactionToUpdate.title : '', [Validators.required]],
      amount: [this.transactionToUpdate?.amount ? this.transactionToUpdate.amount : '', [Validators.required]],
      category: [this.transactionToUpdate?.category ? this.transactionToUpdate.category : '', [Validators.required]],
      type: [this.transactionToUpdate?.type ? this.transactionToUpdate.type : '', [Validators.required]],
    })
  }

  async onSubmit() {
    if (this.transactionsUpdateForm.invalid) {
      setTimeout(() => { this.formDir.resetForm(); this.isLoad = false }, 3000)

      return;
    }

    let number = this.transactionsUpdateForm.value.amount.toString().replaceAll(' ', '').replaceAll('.', '').replaceAll('R$', '').replace(',', '.').replace('-', '').replace('+', '')

    let amount = parseFloat(number);

    if (isNaN(amount)) {
      this.transactionsUpdateForm.setErrors(Validators.requiredTrue)
      return;
    }

    let data: Transaction = { ...this.transactionsUpdateForm.value, amount };
    this.isLoad = true
    let sessionId = localStorage.getItem('sessionId');

    this.transactionsService.update({ ...data, id: this.transactionToUpdate!.id }, sessionId!).subscribe({
      next: () => {
        localStorage.removeItem('request');
        localStorage.removeItem('limitedItems');
        localStorage.removeItem('summary');
        localStorage.removeItem('updt-transaction')
      },
      error: () => { },
      complete: () => {
        this.formDir.resetForm()
        this.isLoad = false;
        this.transactionsUpdated.emit()
      }
    })
  }
}
