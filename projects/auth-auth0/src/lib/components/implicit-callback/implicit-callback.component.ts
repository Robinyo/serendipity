import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Component({ template: `` })
export class ImplicitCallbackComponent implements OnInit, AfterViewInit {

  constructor(private authService: AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('ImplicitCallbackComponent: ngOnInit()');
  }

  public ngAfterViewInit() {

    this.logger.info('ImplicitCallbackComponent: ngAfterViewInit()');

    // this.authService.handleRedirectCallback();
  }

}
