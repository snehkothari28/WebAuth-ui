import { Component, OnDestroy, OnInit } from '@angular/core';
import { TotpService } from '../totp.service';
import { TotpResponse } from '../model/totp-response';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {HostListener } from '@angular/core';
import validator from 'validator';

@Component({
  selector: 'app-all-totp-fetcher',
  templateUrl: './all-totp-fetcher.component.html',
  styleUrls: ['./all-totp-fetcher.component.css'],
})
export class AllTotpFetcherComponent implements OnInit, OnDestroy {
  allOtps!: TotpResponse[];
  interval: any;
  searchText:any;
  isVisible=true;
  toggle = true;
  // status = 'Auto-blur OFF'; 
  status = 'Auto-blur ON'; 
  test=true;
  
  @HostListener('window:focus', ['$event'])
  onFocused() {
    this.isVisible = true;
  }
  @HostListener('window:blur', ['$event'])
  onBlur() {
    
    if(!this.toggle ){
      this.isVisible = false;
    }
    this.toastr.warning("Window out of focus","",{disableTimeOut:true,closeButton:true});   
  
  }   
  enableDisableRule() {
    this.toggle = !this.toggle;
    // this.status = this.toggle ? 'Auto-blur OFF' : 'Auto-blur ON';
    this.status = this.toggle ? 'Auto-blur ON' : 'Auto-blur OFF';

    // if(this.status='OFF')
    // {
    //   this.onBlur();
    //   this.ngOnInit();
    // }
    // else
    // {
    //   this.onFocused();
    //   this.ngOnInit();
    // } 
    
    // if(this.status=='Auto-blur OFF')
    // {
    //   this.test=true;
    //   this.getAllOtps();
    // }
    // else
    // {
    //   this.test=false;
    // }
    if(this.status=='Auto-blur ON')
    {
      this.test=false;
    }
    else
    {
      this.test=true;
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
      if(this.isVisible )
      {
        this.getAllOtps();
      }
      else
      {
        console.log("Window out of focus");       
      }
      },30000);
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
