import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  companyName = environment.companyName;
  isLoading = false;

  constructor(
    private msalService: MsalService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  private handleAuthResponse(response: AuthenticationResult): void {
    try {
      this.msalService.instance.setActiveAccount(response.account);
      
      const idToken = response.idToken;
      
      if (idToken) {
        sessionStorage.setItem('token', idToken);
        this.router.navigate(['/home']);
      } else {
        console.warn('No ID token in response');
        this.toastr.error('No ID token received');
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Error handling auth response:', error);
      this.toastr.error('Authentication failed. Please try again.');
      this.isLoading = false;
    }
  }

  loginWithMicrosoft(): void {
    this.isLoading = true;
    this.msalService.loginPopup({
      scopes: ['openid', 'profile', 'email'],
    }).subscribe({
      next: (response: AuthenticationResult) => {
        this.handleAuthResponse(response);
      },
      error: (error: any) => {
        console.error('Login popup error:', error);
        this.isLoading = false;
        this.toastr.error('Login failed. Please try again.');
      }
    });
  }
}