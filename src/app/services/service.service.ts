
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
    return this.http.post('https://m1p11mean-aro-kenny-1.onrender.com/service/new', data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete('https://m1p11mean-aro-kenny-1.onrender.com/service/delete/'+id);
  }

  updateService({ data, id }: { data: any, id: string; }): Observable<any> {
    return this.http.put('https://m1p11mean-aro-kenny-1.onrender.com/service/update/'+id, data);
  }

  getService(id: string): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/service/service/' + id);

  }
  getServices(): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/service/services', this.httpOptions);

  }
}
