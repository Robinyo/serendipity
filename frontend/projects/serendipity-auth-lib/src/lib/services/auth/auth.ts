import { Injectable } from '@angular/core';

import { Auth } from './abstract-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Auth {

  constructor() {
    super();
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public async loginWithRedirect(): Promise<void> {
    return Promise.reject('Auth Service: loginWithRedirect()');
  }

  public handleRedirectCallback(): void {
    this.authenticated = true;
  }

  public async logoutWithRedirect(returnUrl: string): Promise<void> {
    return Promise.reject('Auth Service: logoutWithRedirect()');
  }

  public getCurrentUser(): any {

    // See: 02-flowable.ldif

    return {
      id: '',
      sub: '',
      username: 'flowable',
      name: 'Flowable',
      givenName: '',
      middleName: '',
      familyName: '',
      email: '',
      emailVerified: '',
      groups: ''
    };

    /*

    return {
      id: '',
      sub: '',
      username: 'rob.ferguson',
      name: 'Rob Ferguson',
      givenName: 'Rob',
      middleName: '',
      familyName: 'Ferguson',
      email: '',
      emailVerified: '',
      groups: ''
    };

    */

  }

}

/*

  public getCurrentUser(): any {
    return this.currentUser;
  }

*/
