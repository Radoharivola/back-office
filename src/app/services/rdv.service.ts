import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RdvService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient) { }


  getRdv({ dateInit, dateFin, limit, page, dateSort, done }: { dateInit: string, dateFin: string, limit: number, page: number, dateSort: number, done: boolean }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/rdv/emp/' + dateInit + '/' + dateFin + '/' + limit + '/' + page + '/' + dateSort + '?done=' + done, this.httpOptions);
  }

  update({ data, id }: { data: any, id: any }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/rdv/' + id, data, this.httpOptions);
  }
}
