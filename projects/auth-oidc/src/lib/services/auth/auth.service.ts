import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { OidcConfig } from '../../models/config';
import { OidcConfigService } from '../config.service';

// http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#introduction
// import { UserManager, UserManagerSettings, User } from 'oidc-client';
import * as oidcClient from 'oidc-client';

// http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#introduction
// import * as auth from 'auth';
// import { Auth, User } from 'auth';
import { Auth } from 'auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class OidcAuthService extends Auth {

  private authState$ = new BehaviorSubject(false);

  private authService: oidcClient.UserManager;

  constructor(@Inject(OidcConfigService) private config: OidcConfig,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('OidcAuthService: constructor()');

    this.currentUser = null;

    // this.logger.info('OidcAuthService this.config.oidc: ' + JSON.stringify(this.config.oidc, null, 2));

    const oidcConfig: oidcClient.UserManagerSettings = {
      authority: this.config.oidc.issuer,
      client_id: this.config.oidc.clientId,
      redirect_uri: this.config.oidc.redirectUri,
      post_logout_redirect_uri: this.config.oidc.postLogoutRedirectUri,
      response_type: this.config.oidc.responseType,
      scope: this.config.oidc.scope,
      filterProtocolClaims: this.config.oidc.filterProtocolClaims,
      loadUserInfo: this.config.oidc.loadUserInfo
    };

    // this.logger.info('oidcConfig: ' + JSON.stringify(oidcConfig, null, 2));

    this.authService = new oidcClient.UserManager(oidcConfig);

    this._isAuthenticated().then(state => {

      this.authState$.next(state);

      this.authState$.subscribe((authenticated: boolean) => {

        this.logger.info('OidcAuthService isAuthenticated(): ' + this.authenticated);

        this.authenticated = authenticated;
        this.accessToken = '';
        this.idToken = '';

        if (this.authenticated) {

          this.setAccessToken();

          this.logger.info('OidcAuthService idToken: ' + this.idToken);
          this.logger.info('OidcAuthService accessToken: ' + this.accessToken);
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

  public getCurrentUser(): any {

    return {
      sub: this.currentUser.profile.sub,
      username: this.currentUser.profile.preferred_username,
      name: this.currentUser.profile.name,
      givenName: this.currentUser.profile.given_name,
      middleName: '',
      familyName: this.currentUser.profile.family_name,
      email: this.currentUser.profile.email,
      emailVerified: this.currentUser.profile.email_verified
    };
    // return this.currentUser;
    // return this.currentUser.profile;
  }

  private setAccessToken() {
    this.idToken = this.currentUser.id_token;
    this.accessToken = this.currentUser.access_token;
  }

  public createUserWithEmailAndPassword(user): Promise<any> {

    return Promise.reject('OidcAuthService: createUserWithEmailAndPassword()');
  }

  public loginWithEmailAndPassword(username: string, password: string): Promise<any> {

    return Promise.reject('OidcAuthService: loginWithEmailAndPassword()');
  }

  public async loginWithRedirect(): Promise<void> {

    this.logger.info('OidcAuthService: loginWithRedirect()');

    return this.authService.signinRedirect();
  }

  public async handleRedirectCallback(): Promise<void> {

    this.logger.info('OidcAuthService: handleRedirectCallback()');

    this.currentUser = await this.authService.signinRedirectCallback();

    this.logger.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));

    this.authenticated = await this._isAuthenticated();

    this.authState$.next(this.authenticated);

    this.router.navigate(['/']);
    // this.router.navigate(['/users/profile']);
  }

  public logout(returnUrl: string) {

    this.logger.info('OidcAuthService: logout()');

    this.authState$.next(false);

    this.authService.signoutRedirect();
  }

  //
  // Private methods
  //

  private async _isAuthenticated(): Promise<boolean> {

    return this.currentUser !== null && !this.currentUser.expired;
  }

}
