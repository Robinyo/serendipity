import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthOktaService } from '../../services/auth/auth-okta.service';

import { LoggerService } from 'utils';

@Component({ template: `` })
export class LoginComponent implements AfterViewInit, OnInit {

  constructor(private authService: AuthOktaService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('LoginComponent: ngOnInit()');
  }

  public ngAfterViewInit() {

    this.logger.info('LoginComponent: ngAfterViewInit()');

    // this.authService.auth.loginRedirect();
    this.authService.auth.authorizationCodeRedirect();
  }

}

// https://github.com/okta/okta-oidc-js/blob/master/packages/okta-angular/src/okta/components/login-redirect.component.ts
