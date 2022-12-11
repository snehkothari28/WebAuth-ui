import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TotpResponse } from './model/totp-response';

@Injectable({
  providedIn: 'root',
})
export class GetAllTotpService {
  private backendUrl: String | undefined;
  constructor(private http: HttpClient) {
    // this.getBackendUrl();
  }
  async getBackendUrl() {
    const res =  await this.http
      .get('assets/BackendUrl', { responseType: 'text' }).toPromise();
      // .subscribe(
      //   res =>{
      this.backendUrl = res;
      console.log('Backend url is ' + this.backendUrl)
      //   });

  }

  async getAllTotp(): Promise<Observable<TotpResponse[]>> {
    // if (this.backendUrl === undefined) this.getBackendUrl();
    await this.getBackendUrl();
      // res => res.subscribe((data) => {
      // console.log('Backend url is ' + data);
      // this.backendUrl = data;
    // })
    
    
    console.log(this.backendUrl + "getAll");
    return this.http.get<TotpResponse[]>(this.backendUrl + "getAll");
  }
}
