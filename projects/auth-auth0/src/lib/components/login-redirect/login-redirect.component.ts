import { AfterViewInit, Component, OnInit } from '@angular/core';

import { Auth0AuthService } from '../../services/auth/auth.service';

import { LoggerService } from 'utils';

@Component({ template: `` })
export class LoginRedirectComponent implements AfterViewInit, OnInit {

  constructor(private authService: Auth0AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('LoginRedirectComponent: ngOnInit()');
  }

  public ngAfterViewInit() {

    this.logger.info('LoginRedirectComponent: ngAfterViewInit()');

    this.authService.loginWithRedirect();
  }

}
