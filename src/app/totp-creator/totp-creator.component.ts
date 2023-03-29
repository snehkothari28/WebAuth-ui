import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CreateTOTP } from '../model/create-totp';
import { TotpService } from '../totp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-totp-creator',
  templateUrl: './totp-creator.component.html',
  styleUrls: ['./totp-creator.component.css'],
})
export class TotpCreatorComponent implements OnInit, OnDestroy {
  private sub: any;
  searchText: any;
  isUpdateRequest: boolean = false;
  updateId: Number | undefined;
  isWriteUser: boolean = false;
  isOwner: boolean = false;
  companyDomain = environment.companyDomain;
  keyword = 'types';
  types: string[] = [];
  
  addSecret = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    type: ['', [Validators.required, Validators.minLength(2)]],
    secret: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(200)],
    ],
    url: ['', Validators.maxLength(90)],
    email: [''],
    password: [''],
    delegationTable: this.formBuilder.array([
      this.createDelegationTableGroup('@' + this.companyDomain, false),
    ]),
  });

  createDelegationTableGroup(email: string, writeUser: boolean) {
    return this.formBuilder.group({
      email: [
        { value: email, disabled: !this.isWriteUser && !this.isOwner },
        [
          Validators.required,
          Validators.minLength(this.companyDomain.length + 2),
          Validators.pattern('^[A-Za-z0-9._%+-]+@' + this.companyDomain + '$'),
          Validators.maxLength(45),
        ],
      ],
      isWriteUser: { value: writeUser, disabled: !this.isOwner },
    }) as FormGroup;
  }

  constructor(
    private formBuilder: FormBuilder,
    private totpService: TotpService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.delegationTableFormArray.removeAt(0);
      if (params['id'] != null) {
        const idFromParam = +params['id'];
        this.isUpdateRequest = true;
        this.updateId = idFromParam;
        this.totpService.getSecretKey(idFromParam).subscribe({
          next: (data) => {
            console.log('data received ' + data.id + data.name);
            this.isOwner = data.owner;
            this.isWriteUser = data.writeUser;
            this.addSecret.controls.name.setValue(data.name);
            this.addSecret.controls.type.setValue(data.type);
            this.addSecret.controls.url.setValue(data.url);
            this.addSecret.controls.email.setValue(data.email);
            this.addSecret.controls.password.setValue(data.password);
            this.addSecret.controls.secret.disable();
            if (data.delegationTable !== undefined) {
              data.delegationTable.forEach((element) => {
                this.addSecret.controls.delegationTable.push(
                  this.createDelegationTableGroup(
                    element.email,
                    element.isWriteUser
                  )
                );
              });
            }
          },
          error: (err) => {
            this.errorFunction(err);
          },
        });
      } else {
        this.isOwner = true;
        this.isWriteUser = true;
      }
    });
    this.totpService.getAllTypes().subscribe((types) => {
      this.types = [];
      types.map(type => {
        if (type !== '') 
        this.types.push(type.trim());
      })
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

  onSubmit(): void {
    if (!this.addSecret.valid) {
      console.log('invalid form');
      this.toastr.error('Invalid form, please check');
      return;
    }

    const createTOTP: CreateTOTP = {
      name: this.addSecret.get('name')?.value ?? 'invalid name value',
      type: this.addSecret.get('type')?.value ?? 'Others',
      secretKey: this.addSecret.get('secret')?.disabled
        ? undefined
        : this.addSecret.get('secret')?.value?.replace(/\s/g, ''),
      id: this.updateId,
      url: this.addSecret.get('url')?.value ?? '',
      email: this.addSecret.get('email')?.value ?? '',
      password: this.addSecret.get('password')?.value ?? '',
      delegationTableModel: this.delegationTableFormArray.value,
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
          console.log('Secret updated');
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

  get delegationTableFormArray() {
    return this.addSecret.get('delegationTable') as FormArray;
  }
  deleteFieldValue(i: number) {
    this.delegationTableFormArray.removeAt(i);
    this.delegationTableFormArray.markAsDirty();
  }
  addFieldValue() {
    this.delegationTableFormArray.push(
      this.createDelegationTableGroup('@' + this.companyDomain, false)
    );
  }
}
