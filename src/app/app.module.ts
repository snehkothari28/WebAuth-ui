import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AllTotpFetcherComponent } from './all-totp-fetcher/all-totp-fetcher.component';
import { TotpCreatorComponent } from './totp-creator/totp-creator.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './http-interceptor/auth-interceptor.interceptor';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';
import {
  MsalModule,
  MsalRedirectComponent,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    AllTotpFetcherComponent,
    TotpCreatorComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: AllTotpFetcherComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'createTOTP',
        component: TotpCreatorComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'createTOTP/:id',
        component: TotpCreatorComponent,
        canActivate: [MsalGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'auth',
        component: MsalRedirectComponent,
      },
      {
        path: '**',
        component: LoginComponent,
      },
    ]),

    // Microsoft Authentication - Simplified configuration
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.azure.clientId,
          authority: `https://login.microsoftonline.com/${environment.azure.tenantId}`,
          redirectUri: 'http://localhost:4200',
          postLogoutRedirectUri: 'http://localhost:4200/login',
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      }),
      {
        interactionType: InteractionType.Popup, 
        authRequest: {
          scopes: ['openid', 'profile', 'email'],
        },
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map([
          ['http://localhost:8081', ['openid', 'profile', 'email']],
        ]),
      }
    ),

    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    NgbModule,
    NgbCollapseModule,
    UiSwitchModule,
    MdbCollapseModule,
    AutocompleteLibModule,
    Ng2SearchPipeModule,

    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}