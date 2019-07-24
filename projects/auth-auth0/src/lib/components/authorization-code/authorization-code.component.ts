import { Component, OnInit } from '@angular/core';

import { Auth0AuthService } from '../../services/auth/auth.service';

@Component({ template: `` })
export class AuthorizationCodeCallbackComponent implements OnInit {

  constructor(private authService: Auth0AuthService) {
  }

  public ngOnInit() {

    // this.authService.handleAuthorizationCodeFlow();

  }

}
