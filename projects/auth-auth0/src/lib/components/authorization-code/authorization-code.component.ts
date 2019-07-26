import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({ template: `` })
export class AuthorizationCodeCallbackComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('AuthorizationCodeCallbackComponent: ngOnInit()');
  }

  public ngAfterViewInit() {

    this.logger.info('AuthorizationCodeCallbackComponent: ngAfterViewInit()');

    this.authService.handleRedirectCallback();
  }

}
