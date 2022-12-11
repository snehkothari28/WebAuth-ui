import { Component, OnInit } from '@angular/core';
import { GetAllTotpService } from '../get-all-totp.service';
import { TotpResponse } from '../model/totp-response';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-all-totp-fetcher',
  templateUrl: './all-totp-fetcher.component.html',
  styleUrls: ['./all-totp-fetcher.component.css'],
})
export class AllTotpFetcherComponent implements OnInit {
  allOtps!: TotpResponse[];

  constructor(private getAllTotpService: GetAllTotpService , private clipboard: Clipboard) {}

  ngOnInit(): void {
    // this.getAllTotpService.getBackendUrl();
    this.getAllOtps();
  }

  getAllOtps() {
    this.getAllTotpService.getAllTotp(
).then((data) => {
      data.subscribe((e) => {
        console.log('data  is ' + e);
        this.allOtps = e;
      });
    });
  }

  copyTotp() {
    this.clipboard.copy('Alphonso');
  }
}
