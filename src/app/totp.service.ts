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

  async getAllTotp(): Promise<Observable<TotpResponse[]>> {
    // console.log(this.backendUrl + 'getAll');
    return this.http.get<TotpResponse[]>(this.backendUrl + 'getAll');
  }

  async createTOTP(createTOTP: CreateTOTP) {
    // console.log(this.backendUrl + 'createAuth');
    // console.log(createTOTP);
    await this.http
      .post<CreateTOTP>(this.backendUrl + 'createAuth', createTOTP)
      .toPromise();
    console.log('added TOTP');
  }

  async getSecretKey(id: Number): Promise<Observable<CreateTOTP>> {
    // console.log(this.backendUrl + 'getAll');
    return this.http.get<CreateTOTP>(this.backendUrl + 'get/' + id);
  }

  async updateTOTP(createTOTP: CreateTOTP): Promise<Observable<any>> {
    console.log('updating secretkey ' + createTOTP.id);

    console.log(this.backendUrl + 'update/' + createTOTP.id);
    console.log(createTOTP);
    return this.http.put<any>(
      this.backendUrl + 'update/' + createTOTP.id,
      createTOTP
    );
  }
  async deleteTOTP(id: Number): Promise<Observable<any>> {
    // console.log(this.backendUrl + 'getAll');
    return this.http.delete<any>(this.backendUrl + 'delete/' + id);
  }
}
