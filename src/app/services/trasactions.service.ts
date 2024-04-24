import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../components/ui/transaction-row/transaction-row.component';
import { TransactionsRequestGetBody } from '../components/ui/all-transactions/all-transactions.component';
import { environment } from '../../environments/environment.development';

type CreateTransactions = undefined | null | { sessionId: { value: string; maxAge: number; path: string } }

@Injectable({
  providedIn: 'root'
})

export class TrasactionsService {
  constructor(private http: HttpClient) { }
  private baseUrl = environment.apiUrl;
  get(): Observable<TransactionsRequestGetBody> {
    return this.http.get<TransactionsRequestGetBody>(`${this.baseUrl}/transactions/`, {
      withCredentials: true
    })
  }

  summary(): Observable<{ summary: { total: number; amount: number | string } }> {
    return this.http.get<{ summary: { total: number; amount: number } }>(`${this.baseUrl}/transactions/summary`, {
      withCredentials: true
    })
  }

  post(data: Transaction): Observable<CreateTransactions> {
    return this.http.post<CreateTransactions>(`${this.baseUrl}/transactions/`, data, {
      withCredentials: true
    })
  }

  endSession(): Observable<any> {
    return this.http.put(`${this.baseUrl}/transactions/end-session`, {}, {
      withCredentials: true
    })
  }
}
