import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  
  constructor() {} 

  authenticate(jwt: string): Observable<any> {
    sessionStorage.setItem('token', jwt);
    return of({ success: true });
  }

  isLoggedIn(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    return of(!!token);
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }
}