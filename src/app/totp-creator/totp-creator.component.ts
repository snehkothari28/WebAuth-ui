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
  private createTOTP: CreateTOTP = { name: '', secretKey: '', id: -1 };
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

        this.totpService.getSecretKey(idFromParam).then((e) =>
          e.subscribe((data) => {
            console.log('data received ' + data.id + data.name);
            this.createTOTP = data;
            this.addSecret.controls.name.setValue(data.name);
            this.addSecret.controls.secret.setValue(data.secretKey);
          })
        );
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addSecret = this.formBuilder.group({
    name: new FormControl('', Validators.required),
    secret: new FormControl('', Validators.required),
  });

  onSubmit(): void {
    // const Formthis.addSecret.get('name')?.value
    console.log(this.addSecret.value);
    const createTOTP: CreateTOTP = {
      name: this.addSecret.get('name')?.value ?? 'invalid name value',
      secretKey: this.addSecret.get('secret')?.value ?? 'invalid secret value',
      id: this.createTOTP.id,
    };
    console.log(createTOTP);
    if (createTOTP.id == -1) {
      this.totpService.createTOTP(createTOTP).then((data) => {
        console.log(data);
        console.log(
          'secret added: ' +
            this.addSecret.get('name')?.value +
            ' ' +
            this.addSecret.get('secret')?.value
        );
        this.toastr.info('Added secret', undefined, {
          closeButton: true,
          timeOut: 2000,
        });
        this.router.navigateByUrl('/');
      });
    } else {
      console.log('updating TOTPPP');
      this.totpService.updateTOTP(createTOTP).then((e) => {
        e.subscribe((data) => {
          console.log(data);
          console.log(
            'Secret updated: ' +
              this.addSecret.get('name')?.value +
              ' ' +
              this.addSecret.get('secret')?.value
          );
          this.toastr.info('Updated secret', undefined, {
            closeButton: true,
            timeOut: 2000,
          });
          this.router.navigateByUrl('/');
        });
      });
    }
  }
}
