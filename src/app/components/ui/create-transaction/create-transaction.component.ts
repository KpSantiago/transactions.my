import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrasactionsService } from '../../../services/trasactions.service';
import { Transaction } from '../transaction-row/transaction-row.component';
import { CookieService } from 'ngx-cookie-service';

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

export class CreateTransactionComponent implements OnInit, DoCheck {
  @Output() transactionsCreated: EventEmitter<any> = new EventEmitter()
  @ViewChild('formDir') formDir!: NgForm
  @Input() tranactionToUpdate?: Transaction | undefined | null;

  transactionsForm!: FormGroup
  isLoad: boolean = false;

  constructor(private fb: FormBuilder, private transactionsService: TrasactionsService, private cookieService: CookieService) { }


  ngOnInit(): void {
    this.transactionsForm = this.fb.group({
      title: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      type: ['', [Validators.required]],
    })
  }
  ngDoCheck(): void {
    if (this.tranactionToUpdate) {
      this.tranactionToUpdate.amount = parseInt(this.tranactionToUpdate.amount.toString().replaceAll(/[\-+R$]/g, ''));

    }
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
    let sessionId = localStorage.getItem('sessionId');

    if (this.tranactionToUpdate) {
      this.transactionsService.update({...data, id: localStorage.getItem('updt-transaction-id')!}, sessionId!).subscribe({
        complete: () => {
          localStorage.removeItem('request');
          localStorage.removeItem('limitedItems');
          this.formDir.resetForm()
          this.transactionsCreated.emit()
          this.isLoad = false;
        }
      })
    } else {
      this.transactionsService.post(data, sessionId ? sessionId : undefined).subscribe({
        next: (r) => {
          if (r) {
            localStorage.setItem('sessionId', r.sessionId)
          }
        },
        error: () => { },
        complete: () => {
          localStorage.removeItem('request');
          localStorage.removeItem('limitedItems');
          this.formDir.resetForm()
          this.transactionsCreated.emit()
          this.isLoad = false;
        }
      })
    }

  }
}
