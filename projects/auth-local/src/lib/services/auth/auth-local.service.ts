import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Auth, User } from 'auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthLocalService extends Auth {

  // protected authenticated = false;
  // protected accessToken = '';

  private userSubject: BehaviorSubject<User>;
  private user: Observable<User>;

  constructor(private logger: LoggerService) {

    super();

    this.logger.info('AuthLocalService constructor()');

    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public isAuthenticated(): boolean {

    // return this.getUser();

    return !!this.getUser();

  }

  public async setAccessToken() {
    return;
  }

  public getAccessToken(): string {
    return this.accessToken;
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

  public logout(returnUrl: string) {
    this.userSubject.next(null);
  }

}

// https://blog.angular-university.io/rxjs-switchmap-operator/ - Simulating HTTP requests
// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754 The introduction to Reactive Programming you've been missing
