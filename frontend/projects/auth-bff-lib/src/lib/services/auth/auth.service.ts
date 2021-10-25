import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";

import { CookieService } from 'ngx-cookie-service';

import { Config, EnvironmentService, HttpOptions, LoggerService } from "utils-lib";

import { Auth } from 'auth-lib';

const LOGIN_PATH = '/bff/login';
const LOGOUT_PATH = '/bff/logout';

@Injectable({
  providedIn: 'root'
})
export class BffAuthService extends Auth {

  protected authenticated = false;
  protected config: Config;
  protected httpOptions: HttpOptions | undefined;

  constructor(private router: Router,
              private httpClient: HttpClient,
              private cookieService: CookieService,
              private environmentService: EnvironmentService,
              private logger: LoggerService) {

    super();

    this.config = this.environmentService.getConfig();
  }

  /*

  public isAuthenticated(): boolean {
    return true;
  }

  */

  // /*

  public isAuthenticated(): boolean {

    if (this.cookieService.check('authN')) {

      const value = this.cookieService.get('authN');

      if (value == "true") {

        this.authenticated = true;

        // this.logger.info('AuthService: isAuthenticated() is true');

      }

    }

    return this.authenticated;

  }

  // */

  public async loginWithRedirect(): Promise<void> {

    this.logger.info('AuthService: loginWithRedirect()');

    const subscription: Subscription = this.login().subscribe(response => {

      // this.logger.info('response: ' + JSON.stringify(response, null, 2));
      // this.logger.info('authorizationRequestUrl: ' + response.body.authorizationRequestUrl);

      subscription.unsubscribe();

      // See: getHttpOptions() -> observe: 'response'
      // window.location.href = response.authorizationRequestUrl;
      window.location.href = response.body.authorizationRequestUrl;

    });

  }

  private login(): Observable<any> {

    this.logger.info('AuthService: login()');

    return this.httpClient.post(this.getUrlPrefix() + LOGIN_PATH, {}, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('AuthService: login() completed');
      })
    );

  }

  public handleRedirectCallback(): void {

    this.logger.info('AuthService: handleRedirectCallback()');

    this.authenticated = true;

  }

  public async logoutWithRedirect(returnUrl: string): Promise<void> {

    this.logger.info('AuthService: logoutWithRedirect()');

    const subscription: Subscription = this.logout().subscribe(response => {

      subscription.unsubscribe();

      this.authenticated = false;

      this.router.navigate([returnUrl]);

    });

  }

  private logout(): Observable<any> {

    this.logger.info('AuthService: logout()');

    return this.httpClient.post(this.getUrlPrefix() + LOGOUT_PATH, {}, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('AuthService: logout() completed');
      })
    );

  }

  private getHttpOptions(params: any = undefined): HttpOptions {

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response',
        params: undefined
      };

    }

    if (params) {
      this.httpOptions.params = params;
    }

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

  private getUrlPrefix(): string {
    return this.config.serverScheme + '://' + this.config.serverHost + ':' + this.config.serverPort;
  }

}
