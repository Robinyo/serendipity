/*
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';

import { Observable, Observer } from 'rxjs';

import * as OktaAuth from '@okta/okta-auth-js';

import {
  assertIssuer,
  assertClientId,
  assertRedirectUri,
  buildConfigObject
} from '@okta/configuration-validation';

import { OKTA_CONFIG, OktaConfig } from '../../models/okta.config';
import { UserClaims } from '../../models/user-claims';

// import packageInfo from '../packageInfo';
// See: https://github.com/okta/okta-oidc-js/blob/master/util/write-package-info.js

const packageInfo = {
  name: 'okta/okta-angular',
  version: '1.2.1'
};

@Injectable()
export class OktaAuthService {

  private oktaAuth: OktaAuth;
  private config: OktaConfig;
  private observers: Observer<boolean>[];
  $authenticationState: Observable<boolean>;

  constructor(@Inject(DOCUMENT) private document: any,
              @Inject(OKTA_CONFIG) private auth: OktaConfig,
              private http: HttpClient,
              private router: Router) {

    // Assert Configuration
    assertIssuer(auth.issuer, auth.testing);
    assertClientId(auth.clientId);
    assertRedirectUri(auth.redirectUri);

    this.observers = [];

    this.oktaAuth = new OktaAuth(buildConfigObject(auth));

    this.oktaAuth.userAgent = `${packageInfo.name}/${packageInfo.version} ${this.oktaAuth.userAgent}`;

    /**
     * Scrub scopes to ensure 'openid' is included
     */
    auth.scope = this.scrubScopes(auth.scope);

    /**
     * Cache the auth config.
     */
    this.config = auth;

    this.$authenticationState = new Observable((observer: Observer<boolean>) => {this.observers.push(observer); });
  }

  /**
   * Checks if there is an access token and id token
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const idToken = await this.getIdToken();
    return !!(accessToken || idToken);
  }

  private async emitAuthenticationState(state: boolean) {
    this.observers.forEach(observer => observer.next(state));
  }

  /**
   * Returns the current accessToken in the tokenManager.
   */
  async getAccessToken(): Promise<string | undefined>  {
    try {
      const accessToken = await this.oktaAuth.tokenManager.get('accessToken');
      return accessToken.accessToken;
    } catch (err) {
      // The user no longer has an existing SSO session in the browser.
      // (OIDC error `login_required`)
      // Ask the user to authenticate again.
      return undefined;
    }
  }

  /**
   * Returns the current idToken in the tokenManager.
   */
  async getIdToken(): Promise<string | undefined> {
    try {
      const idToken = await this.oktaAuth.tokenManager.get('idToken');
      return idToken.idToken;
    } catch (err) {
      // The user no longer has an existing SSO session in the browser.
      // (OIDC error `login_required`)
      // Ask the user to authenticate again.
      return undefined;
    }
  }

  /**
   * Returns user claims from the /userinfo endpoint if an
   * accessToken is provided or parses the available idToken.
   */
  async getUser(): Promise<UserClaims|undefined> {
    const accessToken = await this.oktaAuth.tokenManager.get('accessToken');
    const idToken = await this.oktaAuth.tokenManager.get('idToken');
    if (accessToken && idToken) {
      const userinfo = await this.oktaAuth.token.getUserInfo(accessToken);
      if (userinfo.sub === idToken.claims.sub) {
        // Only return the userinfo response if subjects match to
        // mitigate token substitution attacks
        return userinfo;
      }
    }
    return idToken ? idToken.claims : undefined;
  }

  /**
   * Returns the configuration object used.
   */
  getOktaConfig(): OktaConfig {
    return this.config;
  }

  // https://developer.okta.com/docs/reference/api/oidc/#authorize

  async authorizationCodeRedirect() {

    const url = this.auth.issuer + '/v1/authorize'
      + '?response_type=' + encodeURIComponent(this.auth.responseType)
      + '&client_id=' + encodeURIComponent(this.auth.clientId)
      + '&state=' + encodeURIComponent(this.auth.state)
      + '&scope=' + encodeURIComponent(this.auth.scope)
      + '&redirect_uri=' + encodeURIComponent(this.auth.redirectUri)
      + '&code_challenge=' + encodeURIComponent(this.auth.code_challenge)
      + '&code_challenge_method=' + encodeURIComponent(this.auth.code_challenge_method);

    this.document.location.href = url;
  }

  /**
   * Launches the login redirect.
   */
  loginRedirect(fromUri?: string, additionalParams?: object) {

    if (fromUri) {
      this.setFromUri(fromUri);
    }

    this.oktaAuth.token.getWithRedirect({
      responseType: (this.config.responseType || 'id_token token').split(' '),
      // Convert scopes to list of strings
      scopes: this.config.scope.split(' '),
      ...additionalParams
    });

  }

  /**
   * Stores the intended path to redirect after successful login.
   */
  setFromUri(uri: string, queryParams?: object) {
    const json = JSON.stringify({
      uri: uri,
      params: queryParams
    });
    localStorage.setItem('referrerPath', json);
  }

  /**
   * Returns the referrer path from localStorage or app root.
   */
  getFromUri(): { uri: string, extras: NavigationExtras } {
    const referrerPath = localStorage.getItem('referrerPath');
    localStorage.removeItem('referrerPath');

    const path = JSON.parse(referrerPath) || { uri: '/', params: {} };
    const navigationExtras: NavigationExtras = {
      queryParams: path.params
    };

    return {
      uri: path.uri,
      extras: navigationExtras
    };
  }

  // https://developer.okta.com/docs/reference/api/oidc/#token

  async handleAuthorizationCodeFlow(): Promise<void> {

    const params = new URLSearchParams(this.document.location.search.substring(1));
    const code = params.get('code');
    const state = params.get('state');

    console.log('code: ' + code);
    console.log('state: ' + state);

    const endpoint = this.auth.issuer + '/v1/token';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    };

    const body = {
      grant_type: 'authorization_code',
      client_id: this.auth.clientId,
      redirect_uri: this.auth.redirectUri,
      code: code,
      code_verifier: 'M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag'
    };

    const urlEncoded = Object.keys(body).map(key => key + '=' + body[key]).join('&');

    const response = await this.http.post<any>(endpoint, urlEncoded, httpOptions).toPromise()
      .catch( error => {
        console.log('error: ' + JSON.stringify(error));
      });

    console.log('response: ' + JSON.stringify(response));

    if (response.id_token) {
      this.oktaAuth.tokenManager.add('idToken', response.id_token);
    }

    // ERROR Error: Uncaught (in promise): AuthSdkError: Token must be an Object with scopes, expiresAt, and an idToken or
    // accessToken properties

    if (response.access_token) {
      this.oktaAuth.tokenManager.add('accessToken', response.access_token);
    }

    if (await this.isAuthenticated()) {
      this.emitAuthenticationState(true);
    }

    const fromUri = this.getFromUri();
    this.router.navigate([fromUri.uri], fromUri.extras);
  }

  async handleImplicitFlow(): Promise<void> {

    const tokens = await this.oktaAuth.token.parseFromUrl();

    tokens.forEach(token => {

      if (token.idToken) {
        this.oktaAuth.tokenManager.add('idToken', token);
      }

      if (token.accessToken) {
        this.oktaAuth.tokenManager.add('accessToken', token);
      }

    });

    if (await this.isAuthenticated()) {
      this.emitAuthenticationState(true);
    }

    /**
     * Navigate back to the initial view or root of application.
     */
    const fromUri = this.getFromUri();
    this.router.navigate([fromUri.uri], fromUri.extras);
  }

  /**
   * Clears the user session in Okta and removes
   * tokens stored in the tokenManager.
   */
  async logout(uri?: string): Promise<void> {
    this.oktaAuth.tokenManager.clear();
    await this.oktaAuth.signOut();
    this.emitAuthenticationState(false);
    this.router.navigate([uri || '/']);
  }

  /**
   * Scrub scopes to ensure 'openid' is included
   */
  scrubScopes(scopes: string): string {
    if (!scopes) {
      return 'openid email';
    }
    if (scopes.indexOf('openid') === -1) {
      return scopes + ' openid';
    }
    return scopes;
  }
}

// https://developer.okta.com/code/javascript/okta_auth_sdk/

// https://github.com/okta/okta-auth-js#tokenmanageraddkey-token

/*

  async authorizationCodeRedirect() {

    const endpoint = this.auth.issuer + '/v1/authorize';

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      })
    };

    const body = {
      response_type: this.auth.responseType,
      client_id: this.auth.clientId,
      state: this.auth.state,
      scope: this.auth.scope,
      redirect_uri: this.auth.redirectUri,
      code_challenge: this.auth.code_challenge,
      code_challenge_method: this.auth.code_challenge_method
    };

    const response = await this.http.post<any>(endpoint, body, httpOptions).toPromise()
      .catch( error => {

        console.log('error: ' + error);
      });

    console.log('response' + JSON.stringify(response));
  }

  async handleAuthorizationCodeFlow(code: string, state: string): Promise<void> {

    const endpoint = this.auth.issuer + '/v1/token';

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      })
    };

    const body = {
      grant_type: 'authorization_code',
      client_id: this.auth.clientId,
      redirect_uri: this.auth.redirectUri,
      code: code,
      code_verifier: 'M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag'
    };

    const response = await this.http.post<any>(endpoint, body, httpOptions).toPromise()
      .catch( error => {
        console.log('error: ' + JSON.stringify(error));
      });

    console.log('response: ' + JSON.stringify(response));

    if (response.id_token) {
      this.oktaAuth.tokenManager.add('idToken', response.id_token);
    }
    if (response.access_token) {
      this.oktaAuth.tokenManager.add('accessToken', response.access_token);
    }

    if (await this.isAuthenticated()) {
      this.emitAuthenticationState(true);
    }

    const fromUri = this.getFromUri();
    this.router.navigate([fromUri.uri], fromUri.extras);
  }

*/
