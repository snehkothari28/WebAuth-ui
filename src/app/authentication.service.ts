import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment'; 

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backendUrl = environment.backEndUrl;

  constructor(private http: HttpClient) {}

  authenticate(jwt: string): Observable<any> {
    sessionStorage.setItem('token', jwt);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwt}`,
    });

    return this.http.get(`${this.backendUrl}authenticate`, { headers });
  }

  isLoggedIn(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    return of(!!token);
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }
}
