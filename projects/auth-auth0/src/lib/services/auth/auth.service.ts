import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Auth0Config } from '../../models/models';
import { Auth0ConfigService } from '../config.service';

// import { Auth, User } from 'auth';
import { Auth } from 'auth';

import { LoggerService } from 'utils';

import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

@Injectable({
  providedIn: 'root'
})
export class Auth0AuthService extends Auth {

  // protected authenticated = false;
  // protected accessToken = '';

  $authenticationState = new BehaviorSubject(false);
  // $profile = new BehaviorSubject<User>(null);
  $profile = new BehaviorSubject<any>(null);

  private auth: Auth0Client;

  constructor(@Inject(Auth0ConfigService) private config: Auth0Config,
              private logger: LoggerService) {

    super();

    this.logger.info('Auth0AuthService: constructor()');

    createAuth0Client(this.config.auth0).then(auth0Client => {

      this.auth = auth0Client;

      this.logger.info('Auth0AuthService: this.auth = auth0Client');

    }).catch(e => {
        console.error(`.catch(${e})`);
    });

  }

  public isAuthenticated(): boolean {

    this.logger.info('Auth0AuthService isAuthenticated(): ' + this.authenticated);

    return this.authenticated;
  }

  public async setAccessToken() {

    this.logger.info('Auth0AuthService: setAccessToken()');

    // this.accessToken = await this.auth.getAccessToken();
  }

  public getAccessToken(): string {

    this.logger.info('Auth0AuthService: getAccessToken()');

    return this.accessToken;
  }

  loginWithRedirect() {

    this.logger.info('Auth0AuthService: loginWithRedirect()');

    this.auth.loginWithRedirect({});
  }

}
