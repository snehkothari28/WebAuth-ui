import { Component, OnDestroy, OnInit } from '@angular/core';
import { TotpService } from '../totp.service';
import { TotpResponse } from '../model/totp-response';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HostListener } from '@angular/core';
import validator from 'validator';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-all-totp-fetcher',
  templateUrl: './all-totp-fetcher.component.html',
  styleUrls: ['./all-totp-fetcher.component.css'],
})
export class AllTotpFetcherComponent implements OnInit, OnDestroy {
  filter(item: TotpResponse, filter: string): any {
    if (filter == null || filter.length == 0) return true;
    if (item.type == null || item.type.length == 0) return false;
    return item.type.toUpperCase() === filter.toUpperCase();
  }
  allOtps!: TotpResponse[];
  interval: any;
  searchText: any;
  FilterType: any = '';
  isVisible = true;
  toggle = true;
  autoBlur = true;
  token = sessionStorage.getItem('token') as string;
  obj: any = jwt_decode(this.token);
  typelist: string[] = [];
  @HostListener('window:focus', ['$event'])
  onFocused() {
    this.isVisible = true;
    this.getAllOtps();
    setTimeout(() => {
      if (this.isVisible) this.toastr.clear();
    }, 15000);
  }
  @HostListener('window:blur', ['$event'])
  onBlur() {
    if (this.toggle) {
      this.isVisible = false;
      this.toastr.warning(
        "Window out of focus.Turn off 'Auto-blur' switch to disable",
        '',
        { disableTimeOut: true, closeButton: true }
      );
    }
  }
  enableDisableRule(toggle: boolean) {
    this.toggle = toggle;
    localStorage.setItem('toggle', String(this.toggle));
    if (this.toggle) {
      this.autoBlur = true;
    } else {
      this.autoBlur = false;
      this.getAllOtps();
    }
  }

  companyName = environment.companyName;
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
      if (this.isVisible) {
        this.getAllOtps();
      } else {
        console.log('Window out of focus');
      }
    }, 15000);
    if (localStorage.getItem('toggle') !== null) {
      this.toggle = localStorage.getItem('toggle') == 'true';
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    return this.router.navigateByUrl('/login?autologin=false');
  }
  getAllOtps() {
    console.log('Fetching TOTPs');
    this.totpService.getAllTotp().subscribe({
      next: (data) => {
        this.allOtps = data;
        console.log('Fetch succesful');
        this.typelist.splice(0);
        this.allOtps.map((e) => {
          if (
            e.type != null &&
            e.type.trim().length !== 0 &&
            !this.typelist.includes(e.type)
          ) {
            this.typelist.push(e.type);
          }
        });
      },
      error: (err) => {
        this.errorFunction(err);
      },
    });
  }

  copyTotp(textToCopy: string) {
    if (!textToCopy || textToCopy.trim().length === 0) return;
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
          this.getAllOtps();
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
  goToLink(url: string) {
    this.copyTotp(url);
    if (validator.isURL(url)) {
      if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
      }
      console.log(url);
      window.open(url);
    }
  }
}
