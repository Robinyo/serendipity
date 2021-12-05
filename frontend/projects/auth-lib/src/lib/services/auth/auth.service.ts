import { Injectable } from '@angular/core';

import { Auth } from './auth';

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
    return Promise.reject('AuthService: loginWithRedirect()');
  }

  public handleRedirectCallback(): void {
    this.authenticated = true;
  }

  public async logoutWithRedirect(returnUrl: string): Promise<void> {
    return Promise.reject('AuthService: logoutWithRedirect()');
  }

  public getCurrentUser(): any {
    return this.currentUser;
  }

}
