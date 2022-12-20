import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private backendUrl = environment.backEndUrl;
  constructor(private http: HttpClient) {}

  authenticate(jwt: string): Observable<any> {
    console.log(this.backendUrl + 'authenticate');
    localStorage.setItem('token', jwt);
    return this.http.get<string>(this.backendUrl + 'authenticate');
  }
}
