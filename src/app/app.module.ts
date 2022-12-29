import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AllTotpFetcherComponent } from './all-totp-fetcher/all-totp-fetcher.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { TotpCreatorComponent } from './totp-creator/totp-creator.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './http-interceptor/auth-interceptor.interceptor';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: AllTotpFetcherComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'createTOTP',
        component: TotpCreatorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'createTOTP/:id',
        component: TotpCreatorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: '**',
        component: LoginComponent,
      },
    ]),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [
    AppComponent,
    AllTotpFetcherComponent,
    TotpCreatorComponent,
    LoginComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
