import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchatsService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient) { }

  getAchats(): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/depense/achats');
  }

  newAchats({ data }: { data: any; }): Observable<any> {
    return this.http.post('https://m1p11mean-aro-kenny-1.onrender.com/depense/new', data);
  }

  deleteAchats(id: string): Observable<any> {
    return this.http.delete('https://m1p11mean-aro-kenny-1.onrender.com/depense/delete/'+id);
  }

  update({ data, id }: { data: any, id: any }): Observable<any> {
    return this.http.put('https://m1p11mean-aro-kenny-1.onrender.com/depense/update/'+id, data, this.httpOptions);

  }

  getAchat({ id }: { id: any }): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/depense/achats/' + id, this.httpOptions);
  }
}
