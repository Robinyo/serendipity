import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginRedirectComponent implements OnInit {

  constructor(private authService: AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('LoginRedirectComponent: ngOnInit()');

    this.authService.loginWithRedirect();
  }

}
