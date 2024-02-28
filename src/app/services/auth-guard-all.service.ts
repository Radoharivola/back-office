import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service'; // Update the path to auth.service
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAllService implements CanActivate {

  constructor(private authService: UserService, private router: Router) { }
  canActivate(): boolean {
    // return this.authService.test().pipe(map(response => {
    //   // If the test is successful, allow access to the route
    //   return true;
    // },error=>{
    //   console.log(error);
    //   this.router.navigate(['/login']);
    //   return false;
    // }));
    if (this.authService.test()) {
      return true; // Allow access to the route
    } else {
      this.router.navigate(['/login']); // Redirect to login page if not logged in
      return false; // Deny access to the route
    }
  }

}
