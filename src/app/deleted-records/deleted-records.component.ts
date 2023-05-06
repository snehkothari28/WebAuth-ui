import { Component } from '@angular/core';
import { TotpResponse } from '../model/totp-response';
import { TotpService } from '../totp.service';
import { error } from 'console';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import validator from 'validator';


@Component({
  selector: 'app-deleted-records',
  templateUrl: './deleted-records.component.html',
  styleUrls: ['./deleted-records.component.css']
})
export class DeletedRecordsComponent {

  deletedRecords!: TotpResponse[];
  token = sessionStorage.getItem('token') as string;
  obj: any = jwt_decode(this.token);
  searchText: any;
  FilterType: any = '';
  typelist: string[] = [];


  constructor(
    private totpService: TotpService,
    private router: Router,
    private clipboard: Clipboard,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void{
    this.totpService.getDeletedRecords().subscribe(
      records => {
        this.deletedRecords = records;
      },
      error => {
        console.log("Error fetching deleted records:"+error);
      }
    )
  }
  restoreSecret(id: Number) {
    if (confirm('Are you sure you want to restore the secret key?')) {
      this.totpService.restoreTOTP(id).subscribe({
        next: () => {
          this.toastr.success('Secret key restored successfully');
          this.refreshData();
        },
        error: (err) => {
          this.toastr.error('Failed to restore secret key');
          console.error(err);
        }
      });
    }
    
  }

  filter(item: TotpResponse, filter: string): any {
    if (filter == null || filter.length == 0) return true;
    if (item.type == null || item.type.length == 0) return false;
    return item.type.toUpperCase() === filter.toUpperCase();
  }
  logout() {
    sessionStorage.removeItem('token');
    return this.router.navigateByUrl('/login?autologin=false');
  }
  copyTotp(textToCopy: string) {
    if (!textToCopy || textToCopy.trim().length === 0) return;
    this.clipboard.copy(textToCopy);
    this.toastr.info('Copied to clipboard');
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



