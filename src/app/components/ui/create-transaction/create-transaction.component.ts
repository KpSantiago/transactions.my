import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrasactionsService } from '../../../services/trasactions.service';
import { Transaction } from '../transaction-row/transaction-row.component';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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

    let amount = Number(this.transactionsForm.value['amount'])
    if (isNaN(amount)) {
      this.transactionsForm.setErrors(Validators.requiredTrue)
      return;
    }
    let data: Transaction = { ...this.transactionsForm.value, amount };

    this.isLoad = true
    this.transactionsService.post(data).subscribe({
      next: () => {
        localStorage.removeItem('request');
        localStorage.removeItem('limitedItems');
        this.formDir.resetForm()
        this.transactionsCreated.emit()
      },
      error: (e) => {
        console.log(e)
      },
      complete: async () => {
        this.isLoad = false;
      }
    })

  }
}
