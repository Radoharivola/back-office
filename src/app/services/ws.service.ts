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
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/workSchedule/ws/' + empId, this.httpOptions);
  }
  update(id: string, data: any): Observable<any> {
    return this.http.put('https://m1p11mean-aro-kenny-1.onrender.com/workSchedule/' + id, data, this.httpOptions);
  }

  getMyWs(): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/workSchedule/emp', this.httpOptions);
  }
}
