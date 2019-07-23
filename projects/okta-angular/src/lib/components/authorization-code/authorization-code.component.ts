import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

import { OktaAuthService } from '../../services/auth/okta-auth.service';

@Component({ template: `` })
export class OktaAuthorizationCodeCallbackComponent implements OnInit {

  constructor(private authService: OktaAuthService) {
  }

  public ngOnInit() {

    // this.authService.handleImplicitFlow();
    this.authService.handleAuthorizationCodeFlow();

  }

}

// https://stackoverflow.com/questions/38255939/how-to-handle-hash-fragments-from-oauth-redirect-urls-in-angular2-rc3-routing/
