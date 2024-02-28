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
    return this.http.get('http://127.0.0.1:3000/depense/achats');
  }

  newAchats({ data }: { data: any; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/depense/new', data);
  }

  deleteAchats(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/depense/delete/'+id);
  }

  update({ data, id }: { data: any, id: any }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/depense/update/'+id, data, this.httpOptions);

  }

  getAchat({ id }: { id: any }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/depense/achats/' + id, this.httpOptions);
  }
}
