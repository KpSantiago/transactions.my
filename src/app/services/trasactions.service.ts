import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../components/ui/transaction-row/transaction-row.component';
import { TransactionsRequestGetBody } from '../components/ui/all-transactions/all-transactions.component';
import { environment } from '../../environments/environment.development';

export type CreateTransactions = undefined | null | { sessionId: string }

@Injectable({
  providedIn: 'root'
})

export class TrasactionsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get(sessionId: string): Observable<TransactionsRequestGetBody> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Sessionid': `${sessionId}` })

    return this.http.get<TransactionsRequestGetBody>(`${this.baseUrl}/transactions/`, {
      headers: headers,
    })
  }

  summary(sessionId: string): Observable<{ summary: { total: number; amount: number | string } }> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Sessionid': `${sessionId}` })

    return this.http.get<{ summary: { total: number; amount: number } }>(`${this.baseUrl}/transactions/summary`, {
      headers: headers,
    })
  }

  post(data: Transaction, sessionId?: string): Observable<CreateTransactions> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
    if (sessionId) {
      headers = headers.append('Sessionid', sessionId)
    }

    return this.http.post<CreateTransactions>(`${this.baseUrl}/transactions/`, JSON.stringify(data), {
      headers: headers,
    })
  }

  update(data: Transaction, sessionId?: string): Observable<CreateTransactions> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Sessionid': sessionId! })

    return this.http.patch<CreateTransactions>(`${this.baseUrl}/transactions/`, JSON.stringify(data), {
      headers: headers,
    })
  }

  endSession(sessionId: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Sessionid': `${sessionId}` })

    return this.http.put(`${this.baseUrl}/transactions/end-session`, {}, {
      headers: headers,
    })
  }
}
