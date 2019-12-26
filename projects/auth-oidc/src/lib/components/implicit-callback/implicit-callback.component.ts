import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImplicitCallbackComponent implements OnInit {

  constructor(private authService: AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('ImplicitCallbackComponent: ngOnInit()');

    this.authService.handleRedirectCallback();
  }

}
