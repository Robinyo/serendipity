import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { UserManager, UserManagerSettings, User } from 'oidc-client';

import { OidcConfig } from '../../models/models';
import { OidcConfigService } from '../config.service';

// import { Auth, User } from 'auth';
import { Auth } from 'auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class OidcAuthService extends Auth {

  private authState$ = new BehaviorSubject(false);

  private authService: UserManager;
  private user: User = null;

  constructor(@Inject(OidcConfigService) private config: OidcConfig,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('OidcAuthService: constructor()');

    // this.logger.info('OidcAuthService this.config.oidc: ' + JSON.stringify(this.config.oidc, null, 2));

    const oidcConfig: UserManagerSettings = {
      authority: this.config.oidc.issuer,
      client_id: this.config.oidc.clientId,
      redirect_uri: this.config.oidc.redirectUri,
      post_logout_redirect_uri: this.config.oidc.postLogoutRedirectUri,
      response_type: this.config.oidc.responseType,
      scope: this.config.oidc.scope,
      filterProtocolClaims: this.config.oidc.filterProtocolClaims,
      loadUserInfo: this.config.oidc.loadUserInfo
    };

    this.logger.info('oidcConfig: ' + JSON.stringify(oidcConfig, null, 2));

    this.authService = new UserManager(oidcConfig);

    this._isAuthenticated().then(state => {

      this.authState$.next(state);

      this.authState$.subscribe((authenticated: boolean) => {

        this.logger.info('OidcAuthService isAuthenticated(): ' + this.authenticated);

        this.authenticated = authenticated;

        this.accessToken = '';

        if (this.authenticated) {

          this.setAccessToken();

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

  private setAccessToken() {

    this.logger.info('OktaAuthService: setAccessToken()');

    this.accessToken = this.user.access_token;
  }

  // public createUserWithEmailAndPassword(user: User): Promise<any> {
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

     this.user = await this.authService.signinRedirectCallback();

     // this.logger.info('user: ' + JSON.stringify(this.user, null, 2));

     this.authenticated = await this._isAuthenticated();

     this.authState$.next(this.authenticated);

     this.router.navigate(['/']);
  }

  public logout(returnUrl: string) {

    this.logger.info('OidcAuthService: logout()');

    this.authState$.next(false);

    this.authService.signoutRedirect();
  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

  //
  // Private methods
  //

  private async _isAuthenticated(): Promise<boolean> {

    return this.user !== null && !this.user.expired;
  }

}
