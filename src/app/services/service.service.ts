
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient) { }

  

  newService({ data }: { data: any; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/service/new', data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/service/delete/'+id);
  }

  updateService({ data, id }: { data: any, id: string; }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/service/update/'+id, data);
  }

  getService(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/service/service/' + id);

  }
  getServices(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/service/services', this.httpOptions);

  }
}
