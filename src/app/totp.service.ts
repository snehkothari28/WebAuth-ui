import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateTOTP } from './model/create-totp';
import { TotpResponse } from './model/totp-response';

@Injectable({
  providedIn: 'root',
})
export class TotpService {
  private backendUrl = environment.backEndUrl;
  constructor(private http: HttpClient) {}

  getAllTotp(): Observable<TotpResponse[]> {
    // console.log(this.backendUrl + 'getAll');
    return this.http.get<TotpResponse[]>(this.backendUrl + 'getAll');
  }

  createTOTP(createTOTP: CreateTOTP): Observable<any> {
    return this.http.post<CreateTOTP>(
      this.backendUrl + 'createAuth',
      createTOTP
    );
  }

  getSecretKey(id: Number): Observable<CreateTOTP> {
    // console.log(this.backendUrl + 'getAll');
    return this.http.get<CreateTOTP>(this.backendUrl + 'get/' + id);
  }

  updateTOTP(createTOTP: CreateTOTP): Observable<any> {
    console.log('updating secretkey ' + createTOTP.id);

    console.log(this.backendUrl + 'update/' + createTOTP.id);
    console.log(createTOTP);
    return this.http.put<any>(
      this.backendUrl + 'update/' + createTOTP.id,
      createTOTP
    );
  }
  deleteTOTP(id: Number): Observable<any> {
    // console.log(this.backendUrl + 'getAll');
    return this.http.delete<any>(this.backendUrl + 'delete/' + id);
  }
}
