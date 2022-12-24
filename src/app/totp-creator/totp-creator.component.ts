import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CreateTOTP } from '../model/create-totp';
import { TotpService } from '../totp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-totp-creator',
  templateUrl: './totp-creator.component.html',
  styleUrls: ['./totp-creator.component.css'],
})
export class TotpCreatorComponent implements OnInit, OnDestroy {
  private sub: any;
  private createTOTP: CreateTOTP = {
    name: '',
    secretKey: '',
    id: 0,
    url: '',
    email: '',
    password: '',
  };
  isUpdateRequest: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private totpService: TotpService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        const idFromParam = +params['id']; // (+) converts string 'id' to a number
        this.isUpdateRequest = true;
        this.totpService.getSecretKey(idFromParam).subscribe({
          next: (data) => {
            console.log('data received ' + data.id + data.name);
            this.createTOTP = data;
            this.addSecret.controls.name.setValue(data.name);
            this.addSecret.controls.url.setValue(data.url);
            this.addSecret.controls.email.setValue(data.email);
            this.addSecret.controls.password.setValue(data.password);
            this.addSecret.controls.secret.disable();
          },
          error: (err) => {
            this.errorFunction(err);
          },
        });
      }
    });
  }

  private errorFunction(error: any) {
    this.toastr.error('Error Occured, please login again');
    console.log('caught in error' + error);
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addSecret = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    secret: new FormControl('', [Validators.required, Validators.minLength(4)]),
    url: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit(): void {
    console.log(this.addSecret.value);
    const createTOTP: CreateTOTP = {
      name: this.addSecret.get('name')?.value ?? 'invalid name value',
      secretKey: this.addSecret.get('secret')?.disabled
        ? undefined
        : this.addSecret.get('secret')?.value?.replace(/\s/g, ''),
      id: this.createTOTP.id,
      url: this.addSecret.get('url')?.value ?? '',
      email: this.addSecret.get('email')?.value ?? '',
      password: this.addSecret.get('password')?.value ?? '',
    };
    console.log(createTOTP);
    if (!this.isUpdateRequest) {
      this.totpService.createTOTP(createTOTP).subscribe({
        next: () => {
          console.log('added TOTP');
          this.toastr.info('Added secret', undefined, {
            closeButton: true,
            timeOut: 2000,
          });
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.errorFunction(err);
        },
      });
    } else {
      console.log('updating TOTP');
      this.totpService.updateTOTP(createTOTP).subscribe({
        next: () => {
          console.log('Secret updated: ');
          this.toastr.info('Updated secret', undefined, {
            closeButton: true,
            timeOut: 2000,
          });
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.errorFunction(err);
        },
      });
    }
  }
}
