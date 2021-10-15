import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { CookieService } from 'ngx-cookie-service';

import { LoggerService } from "utils-lib";
import {Observable, Subscription} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  protected authenticated = false;

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Access-Control-Allow-Origin': '*'
    })
  };

  // protected urlPrefix: string = 'http' + '://' + 'localhost' +  ':' + '8080';
  protected urlPrefix: string = 'http' + '://' + '127.0.0.1' +  ':' + '8080';
  protected url: string = '';

  constructor(private httpClient: HttpClient,
              private cookieService: CookieService,
              private logger: LoggerService,
              private router: Router) {}

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

  public async loginWithRedirect(): Promise<void> {

    this.logger.info('AuthService: loginWithRedirect()');

    const subscription: Subscription = this.login().subscribe(response => {

      this.logger.info('response: ' + JSON.stringify(response, null, 2));

      subscription.unsubscribe();

      window.location.href = response.authorizationRequestUrl;

    });

  }

  protected login(): Observable<any> {

    this.logger.info('AuthService: login()');

    this.url = this.urlPrefix + '/bff/login';

    return this.httpClient.post(this.url, {}, this.httpOptions).pipe(
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

  protected logout(): Observable<any> {

    this.logger.info('AuthService: logout()');

    this.url = this.urlPrefix + '/bff/logout';

    return this.httpClient.post(this.url, {}, this.httpOptions).pipe(
      tap(() => {
        this.logger.info('AuthService: logout() completed');
      })
    );

  }

}

/*

  protected logout(returnUrl: string) {

    this.logger.info('AuthService: logout()');

    this.authenticated = false;

    this.router.navigate(['/']);
  }

*/
