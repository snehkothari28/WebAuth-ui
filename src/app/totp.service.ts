import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateTOTP } from './model/create-totp';
import { TotpResponse } from './model/totp-response';

@Injectable({
  providedIn: 'root',
})
export class TotpService {
  private backendUrl: String | undefined;
  constructor(private http: HttpClient) {
    // this.getBackendUrl();
  }
  async getBackendUrl() {
    const res = await this.http
      .get('assets/BackendUrl', { responseType: 'text' })
      .toPromise();
    this.backendUrl = res;
    // console.log('Backend url is ' + this.backendUrl);
  }

  async getAllTotp(): Promise<Observable<TotpResponse[]>> {
    await this.getBackendUrl();

    // console.log(this.backendUrl + 'getAll');
    return this.http.get<TotpResponse[]>(this.backendUrl + 'getAll');
  }

  async createTOTP(createTOTP: CreateTOTP) {
    await this.getBackendUrl();

    // console.log(this.backendUrl + 'createAuth');
    // console.log(createTOTP);
    await this.http
      .post<CreateTOTP>(this.backendUrl + 'createAuth', createTOTP)
      .toPromise();
    console.log('added TOTP');
  }

  async getSecretKey(id: Number): Promise<Observable<CreateTOTP>> {
    await this.getBackendUrl();

    // console.log(this.backendUrl + 'getAll');
    return this.http.get<CreateTOTP>(this.backendUrl + 'get/' + id);
  }

  async updateTOTP(createTOTP: CreateTOTP): Promise<Observable<any>> {
    console.log('updating secretkey '+ createTOTP.id);
    await this.getBackendUrl();

    console.log(this.backendUrl + 'update/' + createTOTP.id);
    console.log(createTOTP);
    return this.http.put<any>(
      this.backendUrl + 'update/' + createTOTP.id,
      createTOTP
    );
  }
  async deleteTOTP(id: Number): Promise<Observable<any>> {
    await this.getBackendUrl();

    // console.log(this.backendUrl + 'getAll');
    return this.http.delete<any>(this.backendUrl + 'delete/' + id);
  }
}
