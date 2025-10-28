import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private msalService: MsalService) {}

  ngOnInit(): void {
    this.initializeMsal();
  }

  async initializeMsal(): Promise<void> {
    try {
      await this.msalService.instance.initialize();
      const result = await this.msalService.instance.handleRedirectPromise();

      if (result) {
        this.msalService.instance.setActiveAccount(result.account);

        if (result.accessToken) {
          sessionStorage.setItem('token', result.accessToken);
        }
      }
    } catch (error) {
      console.error('MSAL initialization error:', error);
    }
  }
}
