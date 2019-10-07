import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { OktaConfig } from '../../models/models';
import { OktaConfigService } from '../config.service';

import { Auth, User } from 'auth';

import OktaAuth from '@okta/okta-auth-js';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class OktaAuthService extends Auth {

  authState$ = new BehaviorSubject(false);
  // profile$ = new BehaviorSubject<User>(null);
  // profile$ = new BehaviorSubject<any>(null);

  private auth: OktaAuth;

  constructor(@Inject(OktaConfigService) private config: OktaConfig,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('OktaAuthService: constructor()');

    this.logger.info('OktaAuthService this.config.okta: ' + JSON.stringify(this.config.okta));

    // this.auth = new OktaAuth(this.config.okta);
    this.auth = new OktaAuth({
      issuer: this.config.okta.issuer,
      clientId: this.config.okta.clientId,
      redirectUri: this.config.okta.redirectUri,
      grantType:  this.config.okta.grantType
    });

    this._isAuthenticated().then(authstate => {

      this.authState$.next(authstate);

      this.authState$.subscribe((authenticated: boolean) => {

        this.logger.info('OktaAuthService isAuthenticated(): ' + this.authenticated);

        this.authenticated = authenticated;

        this.accessToken = '';

        if (this.authenticated) {
          this.setAccessToken().then(() => {
            this.logger.info('OktaAuthService accessToken: ' + this.accessToken);
          });
        }

      });

    });

  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  public getIdToken(): string {
    return this.idToken;
  }

  public async setAccessToken() {

    this.logger.info('OktaAuthService: setAccessToken()');

    this.accessToken = await this._getAccessToken();
  }

  public createUserWithEmailAndPassword(user: User): Promise<any> {

    return Promise.reject('AuthService: createUserWithEmailAndPassword()');
  }

  public loginWithEmailAndPassword(username: string, password: string): Promise<any> {

    return Promise.reject('AuthService: loginWithEmailAndPassword()');
  }

  public loginWithRedirect() {

    this.logger.info('OktaAuthService: loginWithRedirect()');

    this.auth.token.getWithRedirect({
      // scopes: ['openid', 'profile', 'email', 'phone', 'address', 'groups'],
      // NOT scopes: 'openid profile email phone address groups',
      responseType: this.config.okta.responseType,
      scopes: this.config.okta.scope
    });

  }

   public async handleRedirectCallback(): Promise<void> {

     this.logger.info('OktaAuthService: handleRedirectCallback()');

     const tokens = await this.auth.token.parseFromUrl();

     // this.logger.info('OktaAuthService handleRedirectCallback() tokens: ' + JSON.stringify(tokens));

     tokens.forEach((token) => {

       if (token.idToken) {

         this.auth.tokenManager.add('idToken', token);

         this.logger.info('OktaAuthService handleRedirectCallback() idToken: ' + JSON.stringify(token));

       } else if (token.accessToken) {

         this.auth.tokenManager.add('accessToken', token);

         this.logger.info('OktaAuthService handleRedirectCallback() accessToken: ' + JSON.stringify(token));
       }

     });

     this.authenticated = await this._isAuthenticated();

     this.authState$.next(this.authenticated);

     this.router.navigate(['/']);
  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

  public logout(returnUrl: string) {

    this.logger.info('OktaAuthService: logout()');

    this.logger.info('returnUrl: ' + returnUrl);

    this._logout(returnUrl);
  }

  //
  // Private methods
  //

  private async _getIdToken(): Promise<string | undefined> {

    try {

      const res = await this.auth.tokenManager.get('idToken');
      return res.idToken;

    } catch (err) {
      // The user no longer has an existing SSO session in the browser.
      // (OIDC error `login_required`)
      // Ask the user to authenticate again.
      return undefined;
    }

  }

  private async _getAccessToken(): Promise<string | undefined>  {

    try {

      const res = await this.auth.tokenManager.get('accessToken');
      return res.accessToken;

    } catch (err) {
      // The user no longer has an existing SSO session in the browser.
      // (OIDC error `login_required`)
      // Ask the user to authenticate again.
      return undefined;
    }

  }

  private async _isAuthenticated(): Promise<boolean> {

    const accessToken = await this._getAccessToken();
    const idToken = await this._getIdToken();

    return !!(accessToken || idToken);
  }

  async _logout(uri?: string): Promise<void> {

    this.auth.tokenManager.clear();
    await this.auth.signOut();

    this.authState$.next(false);

    this.router.navigate([uri || '/']);
  }

}

// https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable

// https://github.com/okta/okta-auth-js
// https://github.com/dogeared/okta-auth-js-pkce-example/blob/master/src/auth/index.js
