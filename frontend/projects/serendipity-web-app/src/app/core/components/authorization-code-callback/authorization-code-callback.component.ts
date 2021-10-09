import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { LoggerService } from "utils-lib";

@Component({
  template: ``
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationCodeCallbackComponent implements OnInit {

  constructor(private router: Router,
              private logger: LoggerService) {}

  ngOnInit(): void {

    this.logger.info('AuthorizationCodeCallbackComponent: ngOnInit()');

    this.router.navigate(['/']);

  }

}
