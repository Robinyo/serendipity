import { Inject, Injectable } from '@angular/core';

import { OktaAuthService } from '@okta/okta-angular';

import { AuthConfig } from '../../models/models';
import { AuthConfigService } from '../config.service';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated: boolean;
  private accessToken = '';

  constructor(public auth: OktaAuthService,
              @Inject(AuthConfigService) private config: AuthConfig,
              private logger: LoggerService) {

    this.auth.$authenticationState.subscribe(
      (authenticated: boolean) => {

        this.authenticated = authenticated;

        this.accessToken = '';

        if (this.authenticated) {
          this.setAccessToken().then(() => {
            this.logger.warn('AuthService accessToken: ' + this.accessToken);
          });
        }

      }
    );

  }

  public isAuthenticated() {
    return this.authenticated;
  }

  public async setAccessToken() {
    this.accessToken = await this.auth.getAccessToken();
  }

  public getAccessToken() {
    return this.accessToken;
  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

  public logout(returnUrl: string) {

    this.auth.logout(returnUrl);
  }

}

// https://github.com/okta/okta-oidc-js/blob/master/packages/okta-angular/src/okta/services/okta.service.ts

// https://blog.angular-university.io/rxjs-switchmap-operator/ - Simulating HTTP requests
// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754 The introduction to Reactive Programming you've been missing

/*


export class AuthService {

  private userSubject: BehaviorSubject<User>;
  private user: Observable<User>;

  constructor() {

    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public isAuthenticated() {
    return this.getUser();
  }

  public getUser() {

    try {

      return this.userSubject.value;

    } catch (error) {
      return undefined;
    }

  }

  public login(username: string, password: string) {

    this.userSubject.next({ username: username, password: password });
    return this.user;
  }

  public logout() {
    this.userSubject.next(null);
  }

}

*/
