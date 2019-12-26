import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { Auth0Config } from '../../models/models';
import { Auth0ConfigService } from '../config.service';

import { Auth, User } from 'auth';

import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class Auth0AuthService extends Auth {

  authState$ = new BehaviorSubject(false);
  user: User;

  private auth: Auth0Client;

  constructor(@Inject(Auth0ConfigService) private config: Auth0Config,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('Auth0AuthService: constructor()');

    this.logger.info('OktaAuthService this.config.auth0: ' + JSON.stringify(this.config.auth0));

    createAuth0Client(this.config.auth0).then(auth0Client => {

      this.logger.info('Auth0AuthService: this.auth = auth0Client');

      this.auth = auth0Client;

      this.auth.isAuthenticated().then(authstate => {

        this.authState$.next(authstate);

        this.authState$.subscribe((authenticated: boolean) => {

          this.logger.info('Auth0AuthService isAuthenticated(): ' + this.authenticated);

          this.authenticated = authenticated;
          this.accessToken = '';

          if (this.authenticated) {

            this.setAccessToken().then(() => {

              this.logger.info('Auth0AuthService accessToken: ' + this.accessToken);

              this.auth.getUser().then(userProfile => {

                this.logger.info('OktaAuthService userProfile: ' + JSON.stringify(userProfile));

                // https://auth0.com/docs/rules/references/user-object#properties-of-the-user-object
                // https://auth0.com/docs/scopes/current/oidc-scopes
                // scope: 'openid profile email phone address'

                // Create normalised User (i.e., givenName NOT given_name)

                this.user = {

                  username: userProfile.sub,
                  // username: userProfile.email,

                  // sub: userProfile.sub,

                  name: userProfile.name,
                  givenName: userProfile.given_name,
                  middleName: userProfile.middle_name,
                  familyName: userProfile.family_name,
                  nickname: userProfile.nickname,
                    // preferredUsername: userProfile.preferred_username
                    // profile: userProfile.profile
                  picture: userProfile.picture,
                    // website: userProfile.website
                    // gender: userProfile.gender
                    // birthdate: userProfile.birthdate
                    // zoneinfo: userProfile.zoneinfo
                    // locale: userProfile.locale
                  updatedAt: userProfile.updated_at,
                  email: userProfile.email,
                  emailVerified: userProfile.email_verified,

                    // address: userProfile.address
                  // phoneNumber: userProfile.phone_number,
                  // phoneNumberVerified: userProfile.phone_verified
                };

                this.logger.info('OktaAuthService this.user: ' + JSON.stringify(this.user));

              });

            });

          } // end if (this.authenticated)

        });
      });
    });

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

    return Promise.reject('Auth0AuthService: createUserWithEmailAndPassword()');
  }

  public loginWithEmailAndPassword(username: string, password: string): Promise<any> {

    return Promise.reject('Auth0AuthService: loginWithEmailAndPassword()');
  }

  public async loginWithRedirect() {

    this.logger.info('Auth0AuthService: loginWithRedirect()');

    this.auth.loginWithRedirect({});
  }

   public async handleRedirectCallback(): Promise<void> {

     this.logger.info('Auth0AuthService: handleRedirectCallback()');

     // const res = await this.auth.handleRedirectCallback();
     // console.log('res: ' + JSON.stringify(res));
     // const authstate = await this.auth.isAuthenticated();
     // this.logger.info('Auth0AuthService handleRedirectCallback() authstate: ' + authstate);
     // this.authenticated = authstate;

     await this.auth.handleRedirectCallback();

     this.authenticated = await this.auth.isAuthenticated();

     this.authState$.next(this.authenticated);

     this.router.navigate(['/']);
  }

  public geUserProfile(): User {

    this.logger.info('Auth0AuthService: getAccessToken()');

    return this.user;
  }

  public async setAccessToken() {

    this.logger.info('Auth0AuthService: setAccessToken()');

    this.accessToken = await this.auth.getTokenSilently();
  }

  public logout(returnUrl: string) {

    this.logger.info('Auth0AuthService: logout()');

    this.logger.info('window.location.origin: ' + window.location.origin);
    this.logger.info('returnUrl: ' + returnUrl);

    this.authState$.next(false);

    this.auth.logout({
      client_id: this.config.auth0.client_id,
      // returnUrl must be specified as an Allowed Callback URL in the Auth0 console
      // returnTo: window.location.origin + returnUrl
      returnTo: window.location.origin
    });

  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

}

// https://stackoverflow.com/questions/39494058/behaviorsubject-vs-observable
