import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthOktaService } from '../../services/auth/auth-okta.service';

import { LoggerService } from 'utils';

@Component({ template: `` })
export class CallbackComponent implements AfterViewInit, OnInit {

  constructor(private authService: AuthOktaService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('CallbackComponent: ngOnInit()');
  }

  public ngAfterViewInit() {

    this.logger.info('CallbackComponent: ngAfterViewInit()');

    // this.authService.auth.handleAuthentication();
  }

}

// https://github.com/okta/okta-oidc-js/blob/master/packages/okta-angular/src/okta/components/callback.component.ts
// https://github.com/okta/okta-oidc-js/blob/master/packages/okta-angular/src/okta/services/okta.service.ts
