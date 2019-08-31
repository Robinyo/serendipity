import { Injectable } from '@angular/core';

import { Auth } from './auth';

import { User } from '../../models/user';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Auth {

  constructor(private logger: LoggerService) {

    super();

    this.logger.info('AuthService: constructor()');
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  public createUserWithEmailAndPassword(user: User) {}

  public loginWithEmailAndPassword(username: string, password: string) {}

  public loginWithRedirect() {
    return;
  }

  public async handleRedirectCallback(): Promise<void> {
    return;
  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

  public logout(returnUrl: string) {

    return;
  }

}
