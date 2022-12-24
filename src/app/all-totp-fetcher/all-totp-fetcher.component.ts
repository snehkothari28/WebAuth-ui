import { Component, OnDestroy, OnInit } from '@angular/core';
import { TotpService } from '../totp.service';
import { TotpResponse } from '../model/totp-response';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-totp-fetcher',
  templateUrl: './all-totp-fetcher.component.html',
  styleUrls: ['./all-totp-fetcher.component.css'],
})
export class AllTotpFetcherComponent implements OnInit, OnDestroy {
  allOtps!: TotpResponse[];
  interval: any;

  constructor(
    private totpService: TotpService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.getAllOtps();
    this.interval = setInterval(() => {
      this.getAllOtps();
    }, 10000);
  }

  getAllOtps() {
    console.log('Fetching TOTPs');
    this.totpService.getAllTotp().subscribe({
      next: (data) => {
        this.allOtps = data;
        console.log('Fetch succesful');
      },
      error: (err) => {
        this.errorFunction(err);
      },
    });
  }

  copyTotp(textToCopy: string) {
    this.clipboard.copy(textToCopy);
    this.toastr.info('Copied to clipboard');
  }

  deleteSecret(totpResponse: TotpResponse) {
    if (confirm('Are you sure you want to delete ' + totpResponse.name)) {
      console.log(
        'deleting totpResponse with id ' +
          totpResponse.id +
          ' and name ' +
          totpResponse.name
      );
      this.totpService.deleteTOTP(totpResponse.id).subscribe({
        next: () => {
          console.log(
            'deleted successfully totpResponse with id ' +
              totpResponse.id +
              ' and name ' +
              totpResponse.name
          );
          this.toastr.info('Delete success');
          this.totpService.getAllTotp();
        },
        error: (err) => {
          this.errorFunction(err);
        },
      });
    }
    this.getAllOtps();
  }

  private errorFunction(error: any) {
    this.toastr.error('Error Occured, please login again');
    console.log('caught in error' + error);
    this.router.navigateByUrl('/login');
  }
}
