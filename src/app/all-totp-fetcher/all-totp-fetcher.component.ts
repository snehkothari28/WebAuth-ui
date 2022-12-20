import { Component, OnInit } from '@angular/core';
import { TotpService } from '../totp.service';
import { TotpResponse } from '../model/totp-response';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { interval, Observable } from 'rxjs';
import { CreateTOTP } from '../model/create-totp';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-totp-fetcher',
  templateUrl: './all-totp-fetcher.component.html',
  styleUrls: ['./all-totp-fetcher.component.css'],
})
export class AllTotpFetcherComponent implements OnInit {
  allOtps!: TotpResponse[];

  constructor(
    private totpService: TotpService,
    private clipboard: Clipboard,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllOtps();
  }

  getAllOtps() {
    this.totpService.getAllTotp().then((data) => {
      this.refreshOtp(data);
      interval(15000).subscribe(
        () => {
          this.refreshOtp(data);
        },
        (error) => {
          this.errorFunction(error);
        }
      );
    });
  }

  refreshOtp(data: Observable<TotpResponse[]>) {
    console.log('refreshing all totps');
    data.subscribe((e) => {
      this.allOtps = e;
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
      this.totpService.deleteTOTP(totpResponse.id).then((e) =>
        e.subscribe(
          (data) => {
            console.log(
              'deleted successfully totpResponse with id ' +
                totpResponse.id +
                ' and name ' +
                totpResponse.name
            );
            this.totpService.getAllTotp().then((data) => {
              this.refreshOtp(data);
            });
          },
          (error) => {
            this.errorFunction(error);
          }
        )
      );
    }
  }
  private errorFunction(error: any) {
    this.toastr.error('Error Occured, please login again');
    console.log('caught in error' + error);
    this.router.navigateByUrl('/login');
  }
}
