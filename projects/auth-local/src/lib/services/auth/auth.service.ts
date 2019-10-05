import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Auth, User } from 'auth';

import { LoggerService } from 'utils';

interface HttpOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  observe?: any;
  params?: HttpParams | { [param: string]: string | Array<string> };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService extends Auth {

  protected readonly loginUrl = 'http://localhost:3001/login/';
  protected readonly registerUrl = 'http://localhost:3001/register/';

  protected httpOptions: HttpOptions;

  private userSubject: BehaviorSubject<User>;
  private user: Observable<User>;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private logger: LoggerService) {

    super();

    this.logger.info('LocalAuthService constructor()');

    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public isAuthenticated(): boolean {

    this.logger.info('LocalAuthService isAuthenticated(): ' + this.authenticated);

    return this.authenticated;
  }

  public getAccessToken(): string {

    this.logger.info('LocalAuthService: getAccessToken()');

    return this.accessToken;
  }

  public async setAccessToken() {

    this.logger.info('LocalAuthService: setAccessToken()');
  }

  public getUser() {

    try {

      return this.userSubject.value;

    } catch (error) {
      return undefined;
    }

  }

  public createUserWithEmailAndPassword(user: User): Promise<any> {

    return this.httpClient.post<any>(this.registerUrl, user, this.getHttpOptions()).pipe(tap((token) => {

        this.accessToken = token;

        this.logger.info('LocalAuthService: createUserWithEmailAndPassword() completed');

        // this.logger.info('token:' + JSON.stringify(token, null, 2));

        this.userSubject.next(user);

        this.authenticated = true;

        // '/profile'
        this.router.navigate(['/']);

    })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error('Connection refused');
      }

      throw error;

    });

  }

  public loginWithEmailAndPassword(username: string, password: string): Promise<any>  {

    const user: User = new User(username, password);

    return this.httpClient.post<any>(this.loginUrl, user, this.getHttpOptions()).pipe(

      tap((token) => {

        this.accessToken = token;

        this.logger.info('LocalAuthService: loginWithEmailAndPassword() completed');

        this.logger.info('token:' + JSON.stringify(token, null, 2));

        this.userSubject.next(user);

        this.authenticated = true;

        this.router.navigate(['/']);

      })).toPromise().catch(error => {

        if (error === undefined) {
          error = new Error('Connection refused');
        }

      throw error;

    });

  }

  public loginWithRedirect() {}
  public async handleRedirectCallback(): Promise<void> {}

  public logout(returnUrl: string) {

    this.userSubject.next(null);

    this.authenticated = false;

    this.router.navigate([returnUrl || '/']);
  }

  protected getHttpOptions(params: HttpParams = null): HttpOptions {

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        // observe: 'response',
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

}

// https://blog.angularindepth.com/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4

// https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192

// https://blog.angular-university.io/rxjs-switchmap-operator/ Simulating HTTP requests
// https://gist.github.com/staltz/868e7e9bc2a7b8c1f754  The introduction to Reactive Programming you've been missing

// https://angular.io/guide/http#getting-error-details
