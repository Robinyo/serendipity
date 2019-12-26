import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationCodeCallbackComponent implements OnInit {

  constructor(private authService: AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('AuthorizationCodeCallbackComponent: ngOnInit()');

    this.authService.handleRedirectCallback();
  }

}
