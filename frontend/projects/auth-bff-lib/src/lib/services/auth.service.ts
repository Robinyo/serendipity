import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

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
    })
  };

  protected urlPrefix: string = 'http' + '://' + 'localhost' +  ':' + '8080';
  protected url: string = '';

  constructor(private httpClient: HttpClient,
              private logger: LoggerService,
              private router: Router) {}

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public async loginWithRedirect(): Promise<void> {

    this.logger.info('AuthService: loginWithRedirect()');

    const subscription: Subscription = this.login().subscribe(response => {

      // this.logger.info('response: ' + JSON.stringify(response, null, 2));

      subscription.unsubscribe();

      window.location = response.authorizationRequestUrl;

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
