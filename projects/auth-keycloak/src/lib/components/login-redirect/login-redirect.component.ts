import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({ template: `` })
export class LoginRedirectComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService,
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
