import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient) { }



  get(year: number, month?: any): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/rdv/stat/' + year + '/' + month, this.httpOptions);
  }
  getCa(year: number, month?: any): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/rdv/ca/' + year + '/' + month, this.httpOptions);
  }
  getBenefits(year: number): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/depense/benefits-per-month/' + year, this.httpOptions);
  }
  getWorkTime(year: number, month: any): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/workSchedule/' + year + '/' + month, this.httpOptions);

  }
}
