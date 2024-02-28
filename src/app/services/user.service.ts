import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient, private router: Router) { }


  getEmployees({ searchString, sortBy, sortOrder }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/employees?searchString=' + searchString + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder, this.httpOptions);
  }

  getEmployee(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/employee/' + id, this.httpOptions);
  }

  newEmployee({ formData }: { formData: FormData; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/auth/register', formData);
  }

  updateEmployee({ formData, id }: { formData: FormData, id: string; }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/auth/users/' + id, formData, { withCredentials: true });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/auth/users/' + id);
  }

  login({ data }: { data: any; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/auth/BOlogin', data, this.httpOptions);
  }

  myProfile(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/emp/profile', this.httpOptions);
  }

  // test(): Observable<any> {
  //   return this.http.get('http://127.0.0.1:3000/protected', this.httpOptions);
  // // }
  // test(): boolean {
  //   return false;
  // }


  isLoggedIn(): boolean {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Decode the token (assuming it's a simple encoded string)
    const decodedToken = atob(token); // Decode the token
    console.log(decodedToken);
    // Check if the decoded token is 'admin'
    return decodedToken === 'manager';
  }

  isEmpLoggedIn(): boolean {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Decode the token (assuming it's a simple encoded string)
    const decodedToken = atob(token); // Decode the token
    console.log(decodedToken);
    // Check if the decoded token is 'admin'
    return decodedToken === 'employee';
  }

  test(): boolean {
    // Check if the token exists in localStorage
    console.log(localStorage.getItem('token'));
    return localStorage.getItem('token') !== null;
  }

  logout(): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/auth/logout', null, this.httpOptions);
  }

}
