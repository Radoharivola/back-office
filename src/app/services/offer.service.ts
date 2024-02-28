import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient) { }
  getOffers({ searchString, sortBy, sortOrder }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/offer/offers?searchString=' + searchString + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder, this.httpOptions);
  }

  new({ data }: { data: any }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/offer/new', data, this.httpOptions);

  }
  delete({ id }: { id: any }): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/offer/delete/' + id, this.httpOptions);

  }
  get({ id }: { id: any }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/offer/offer/' + id, this.httpOptions);
  }

  update({ data, id }: { data: any, id: any }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/offer/update/'+id, data, this.httpOptions);

  }
}
