import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { OAuthService, NullValidationHandler } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';

import { KeycloakConfig } from '../../models/models';
import { KeycloakConfigService } from '../config.service';

import { Auth, User } from 'auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService extends Auth {

  authState$ = new BehaviorSubject(false);

  constructor(@Inject(KeycloakConfigService) private config: KeycloakConfig,
              private oauthService: OAuthService,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('KeycloakAuthService: constructor()');

    this.logger.info('KeycloakAuthService this.config.keycloak: ' + JSON.stringify(this.config.keycloak));

    this.oauthService.configure(this.config.keycloak);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.authState$.next(this._isAuthenticated());

    this.authState$.subscribe((authenticated: boolean) => {

      this.logger.info('OktaAuthService isAuthenticated(): ' + this.authenticated);

      this.authenticated = authenticated;

      this.accessToken = '';

      if (this.authenticated) {

        this.setAccessToken();

        this.logger.info('OktaAuthService accessToken: ' + this.accessToken);
      }

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

    this.accessToken = this.oauthService.getAccessToken();
  }

  public createUserWithEmailAndPassword(user: User): Promise<any> {

    return Promise.reject('KeycloakAuthService: createUserWithEmailAndPassword()');
  }

  public loginWithEmailAndPassword(username: string, password: string): Promise<any> {

    return Promise.reject('KeycloakAuthService: loginWithEmailAndPassword()');
  }

  public loginWithRedirect() {

    this.logger.info('KeycloakAuthService: loginWithRedirect()');

    this.oauthService.initCodeFlow();
  }

   public async handleRedirectCallback(): Promise<void> {

     this.logger.info('KeycloakAuthService: handleRedirectCallback()');

     this.accessToken = this.oauthService.getAccessToken();

     this.authenticated = this._isAuthenticated();

     this.authState$.next(this.authenticated);

     this.router.navigate(['/']);
  }

  public logout(returnUrl: string) {

    this.logger.info('KeycloakAuthService: logout()');

    this.oauthService.logOut();

    this.authState$.next(false);

    this.router.navigate([returnUrl || '/']);
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

  private _isAuthenticated(): boolean {

    const accessToken = this.oauthService.getAccessToken();
    const idToken = this.oauthService.getIdToken();

    return !!(accessToken || idToken);
  }

}

// https://github.com/manfredsteyer/angular-oauth2-oidc/blob/master/projects/lib/src/auth.config.ts
