import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

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

  authState$ = new BehaviorSubject(false);
  // $profile = new BehaviorSubject<User>(null);
  // $profile = new BehaviorSubject<any>(null);

  private auth: Auth0Client;

  constructor(@Inject(Auth0ConfigService) private config: Auth0Config,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('Auth0AuthService: constructor()');

    createAuth0Client(this.config.auth0).then(auth0Client => {

      this.logger.info('Auth0AuthService: this.auth = auth0Client');

      this.auth = auth0Client;

      this.auth.isAuthenticated().then(authstate => {

        this.authState$.next(authstate);

        this.authState$.subscribe((authenticated: boolean) => {

          this.logger.info('Auth0AuthService isAuthenticated(): ' + this.authenticated);

          this.authenticated = authenticated;

          this.accessToken = '';

          if (this.authenticated) {
            this.setAccessToken().then(() => {
              this.logger.info('Auth0AuthService accessToken: ' + this.accessToken);
            });
          }

        });

      });

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

    this.accessToken = await this.auth.getTokenSilently();
  }

  public getAccessToken(): string {

    this.logger.info('Auth0AuthService: getAccessToken()');

    return this.accessToken;
  }

  public loginWithRedirect() {

    this.logger.info('Auth0AuthService: loginWithRedirect()');

    this.auth.loginWithRedirect({});
  }

   public async handleRedirectCallback(): Promise<void> {

     this.logger.info('Auth0AuthService: handleRedirectCallback()');

     const res = await this.auth.handleRedirectCallback();

     // console.log('res: ' + JSON.stringify(res));

     // const authstate = await this.auth.isAuthenticated();
     // this.logger.info('Auth0AuthService handleRedirectCallback() authstate: ' + authstate);
     // this.authenticated = authstate;

     this.authenticated = await this.auth.isAuthenticated();

     this.authState$.next(this.authenticated);

     this.router.navigate(['/']);
  }

  public logout(returnUrl: string) {

    this.logger.info('Auth0AuthService: logout()');

    this.logger.info('window.location.origin: ' + window.location.origin);
    this.logger.info('returnUrl: ' + returnUrl);

    this.authState$.next(false);
    // this.authState$.next(null);

    this.auth.logout({
      client_id: this.config.auth0.client_id,
      returnTo: window.location.origin + returnUrl
    });

  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

}

// https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable

