import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { Auth, User } from 'auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService extends Auth {

  // protected authenticated = false;
  // protected accessToken = '';

  private userSubject: BehaviorSubject<User>;
  private user: Observable<User>;

  constructor(private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('LocalAuthService constructor()');

    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public isAuthenticated(): boolean {

    this.logger.info('OktaAuthService isAuthenticated(): ' + this.authenticated);

    return this.authenticated;
  }

  public getAccessToken(): string {

    this.logger.info('LocalAuthService: getAccessToken()');

    return this.accessToken;
  }

  public async setAccessToken() {

    this.logger.info('LocalAuthService: setAccessToken()');

    return;
  }

  public getUser() {

    try {

      return this.userSubject.value;

    } catch (error) {
      return undefined;
    }

  }

  public createUserWithEmailAndPassword(user: User) {}

  public loginWithEmailAndPassword(username: string, password: string) {

    this.userSubject.next({ username: username, password: password });

    this.authenticated = true;

    this.router.navigate(['/']);
  }

  public loginWithRedirect() {}
  public async handleRedirectCallback(): Promise<void> {}

  public logout(returnUrl: string) {

    this.userSubject.next(null);

    this.authenticated = false;

    this.router.navigate([returnUrl || '/']);
  }

}

// https://blog.angular-university.io/rxjs-switchmap-operator/ - Simulating HTTP requests
// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754 The introduction to Reactive Programming you've been missing

/*

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService extends Auth {

  // protected authenticated = false;
  // protected accessToken = '';

  private userSubject: BehaviorSubject<User>;
  private user: Observable<User>;

  constructor(private logger: LoggerService) {

    super();

    this.logger.info('LocalAuthService constructor()');

    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public isAuthenticated(): boolean {

    this.logger.info('LocalAuthService isAuthenticated()');

    // return this.getUser();
    return !!this.getUser();

  }

  public getAccessToken(): string {

    this.logger.info('LocalAuthService: getAccessToken()');

    return this.accessToken;
  }

  public async setAccessToken() {

    this.logger.info('LocalAuthService: setAccessToken()');

    return;
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

  public loginWithRedirect() {}
  public async handleRedirectCallback(): Promise<void> {}

  public logout(returnUrl: string) {

    this.userSubject.next(null);
  }

}

*/
