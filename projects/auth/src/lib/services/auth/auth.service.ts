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

  public getIdToken(): string {
    return this.idToken;
  }

  public createUserWithEmailAndPassword(user: User): Promise<any> {

    return Promise.reject('AuthService: createUserWithEmailAndPassword()');
  }

  public loginWithEmailAndPassword(username: string, password: string): Promise<any> {

    return Promise.reject('AuthService: loginWithEmailAndPassword()');
  }

  public loginWithRedirect() {
    return Promise.reject('AuthService: loginWithRedirect()');
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
