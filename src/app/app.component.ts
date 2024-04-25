import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { InfosComponent } from './components/ui/infos/infos.component';
import { AllTransactionsComponent } from './components/ui/all-transactions/all-transactions.component';
import { CategoriesComponent } from './components/ui/categories/categories.component';
import { ExpenseChartComponent } from './components/ui/expense-chart/expense-chart.component';
import { TrasactionsService } from './services/trasactions.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { Transaction } from './components/ui/transaction-row/transaction-row.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    InfosComponent,
    AllTransactionsComponent,
    CategoriesComponent,
    ExpenseChartComponent,
    HttpClientModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    TrasactionsService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit, AfterViewInit, DoCheck {
  @ViewChild('profileButton') profileButton!: ElementRef<HTMLElement>

  constructor(private trasactionsService: TrasactionsService, private cookieService: CookieService) { }

  request: Transaction[] | null = JSON.parse(localStorage.getItem('request') || 'null');
  numberLimitedTransactions: Transaction[] | null = JSON.parse(localStorage.getItem('limitedItems') || 'null');
  changeComponents: boolean = false;
  hasSessionId: string | null = localStorage.getItem("sessionId");

  ngOnInit(): void {
    if ((!this.request || !this.numberLimitedTransactions) && this.hasSessionId) {
      this.trasactionsService.get(this.hasSessionId).subscribe({
        next: async (r) => {
          this.numberLimitedTransactions = []
          this.request = r.transactions;
          if (r.transactions.length > 3) {
            for (let i = 0; i < 3; i++) {
              this.numberLimitedTransactions.push(r.transactions[i]);
            }
          } else {
            for (let i = 0; i < r.transactions.length; i++) {
              this.numberLimitedTransactions.push(r.transactions[i]);
            }
          }

          localStorage.setItem('request', JSON.stringify(this.request));
          localStorage.setItem('limitedItems', JSON.stringify(this.numberLimitedTransactions));
        },
        error: async (e) => {
          console.log(e)
        }
      })

      this.trasactionsService.summary(this.hasSessionId).subscribe({
        next: async (r) => {
          r.summary.amount = r.summary.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })

          localStorage.setItem('summary', JSON.stringify(r.summary));
        },
        error: async (e) => {

        }
      })
    }
  }

  ngAfterViewInit(): void {
    let profileBtn = this.profileButton.nativeElement
    profileBtn.addEventListener('click', (e) => {
      if (profileBtn.classList.toggle('actived')) {
        document.querySelector('body')!.style.overflowY = 'hidden'
      } else {
        document.querySelector('body')!.style.overflowY = 'auto'
      }
    })

  }

  ngDoCheck(): void {
    this.hasSessionId = localStorage.getItem('sessionId');
    // if ((!this.numberLimitedTransactions || !this.request) && this.hasSessionId) {
    //   this.componentChanged()
    // }
  }

  componentChanged() {
    if (this.hasSessionId) {
      this.trasactionsService.get(this.hasSessionId).subscribe({
        next: async (r) => {
          this.numberLimitedTransactions = []
          this.request = r.transactions;
          if (r.transactions.length > 3) {
            for (let i = 0; i < 3; i++) {
              this.numberLimitedTransactions.push(r.transactions[i]);
            }
          } else {
            for (let i = 0; i < r.transactions.length; i++) {
              this.numberLimitedTransactions.push(r.transactions[i]);
            }
          }
          localStorage.setItem('request', JSON.stringify(this.request));
          localStorage.setItem('limitedItems', JSON.stringify(this.numberLimitedTransactions));
        },
        error: async (e) => {
          console.log(e)
        },
        complete: () => {
          this.changeComponents = true
        }
      })

      this.trasactionsService.summary(this.hasSessionId).subscribe({
        next: async (r) => {
          r.summary.amount = r.summary.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })

          localStorage.setItem('summary', JSON.stringify(r.summary));
        },
        error: async (e) => {

        }
      })
    }
  }
}
