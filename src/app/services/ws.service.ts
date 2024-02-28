import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient) { }

  getWs(empId: string): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/workSchedule/ws/' + empId, this.httpOptions);
  }
  update(id: string, data: any): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/workSchedule/' + id, data, this.httpOptions);
  }

  getMyWs(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/workSchedule/emp', this.httpOptions);
  }
}
