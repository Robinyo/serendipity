import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  private user: Observable<User>;

  constructor() {

    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public isAuthenticated() {

    try {

      return this.userSubject.value;

    } catch (error) {

      return false;
    }

  }

  public login(username: string, password: string) {

    this.userSubject.next({ username: username, password: username});
    return this.user;
  }

  public logout() {

    this.userSubject.next(null);
  }

}

// https://github.com/okta/okta-oidc-js/blob/master/packages/okta-angular/src/okta/services/okta.service.ts

// https://blog.angular-university.io/rxjs-switchmap-operator/ - Simulating HTTP requests
// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754 The introduction to Reactive Programming you've been missing
