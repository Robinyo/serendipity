import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';

import { LoggerService } from 'utils';

@Component({
  selector: 'auth-okta-login',
  templateUrl: './okta-login.component.html',
  styleUrls: ['./okta-login.component.css']
})
export class OktaLoginComponent implements AfterViewInit, OnInit {

  constructor(private authService: AuthService,
              private logger: LoggerService) {
  }

  ngOnInit() {

    this.logger.info('OktaLoginComponent: ngOnInit()');
  }

  public ngAfterViewInit() {

    this.logger.info('OktaLoginComponent: ngAfterViewInit()');

    this.authService.auth.loginRedirect();
  }

}
