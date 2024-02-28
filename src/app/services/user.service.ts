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
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/users/employees?searchString=' + searchString + '&sortBy=' + sortBy + '&sortOrder=' + sortOrder, this.httpOptions);
  }

  getEmployee(id: string): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/users/employee/' + id, this.httpOptions);
  }

  newEmployee({ formData }: { formData: FormData; }): Observable<any> {
    return this.http.post('https://m1p11mean-aro-kenny-1.onrender.com/auth/register', formData);
  }

  updateEmployee({ formData, id }: { formData: FormData, id: string; }): Observable<any> {
    return this.http.put('https://m1p11mean-aro-kenny-1.onrender.com/auth/users/' + id, formData, { withCredentials: true });
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete('https://m1p11mean-aro-kenny-1.onrender.com/auth/users/' + id);
  }

  login({ data }: { data: any; }): Observable<any> {
    return this.http.post('https://m1p11mean-aro-kenny-1.onrender.com/auth/BOlogin', data, this.httpOptions);
  }

  myProfile(): Observable<any> {
    return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/users/emp/profile', this.httpOptions);
  }

  // test(): Observable<any> {
  //   return this.http.get('https://m1p11mean-aro-kenny-1.onrender.com/protected', this.httpOptions);
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
    return this.http.post('https://m1p11mean-aro-kenny-1.onrender.com/auth/logout', null, this.httpOptions);
  }

}
