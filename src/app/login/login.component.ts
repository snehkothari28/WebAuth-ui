declare var google: any;

import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accounts } from 'google-one-tap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { TotpService } from '../totp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.router.url != '/login') {
      console.log('navigating to login' + ' from ' + this.router.url);
      this.router.navigateByUrl('/login');
    }
    const gAccounts: accounts = google.accounts;

    gAccounts.id.initialize({
      client_id: `${environment.gsiClientId}`,
      callback: ({ credential }) => {
        this.ngZone.run(() => {
          this.handleCredentialResponse(credential);
        });
      },
      auto_select: true,
      context: 'use',
      ux_mode: 'popup',
      itp_support: true,
    });
    gAccounts.id.prompt();
    gAccounts.id.renderButton(document.getElementById('googleLogin')!, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'continue_with',
      logo_alignment: 'center',
      width: 1000,
    });
  }
  handleCredentialResponse(response: string) {
    console.log('loging in');
    this.authenticationService.authenticate(response).subscribe({
      next: () => {
        console.log('routing to home');
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorFunction(err);
      },
    });
  }
  private errorFunction(error: any) {
    this.toastr.error('Error Occured, please login again');

    console.log('caught in error' + error);
    this.router.navigateByUrl('/login');
  }
}
