import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService, User } from 'auth';

import { LoggerService } from 'utils';

export abstract class CollectionService {

  //
  // See: proxy.conf.json
  //

  // private processEngineUriPrefix = 'http://localhost:8080/flowable-task/process-api/runtime/';
  // protected processEngineUriPrefix = '/flowable-task/process-api/';
  protected processEngineUriPrefix = 'http://localhost:3001/process-api/';

  protected httpOptions = null;

  constructor(protected authService: AuthService,
              protected logger: LoggerService) {

  }

  protected getHttpOptions(params: HttpParams = null) {

    this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      const user = this.authService.getCurrentUser();

      this.logger.info('user: ' + JSON.stringify(user, null, 2));

      const token = 'flowable-rest' + ':' + 'test';

      this.logger.info('token: ' + token + ' btoa(token): ' + btoa(token));

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(token)
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

}

/*

  // https://github.com/angular/angular-cli/issues/14595 -> proxyConfig with Windows authentication stopped working after update to 8

  "/flowable-task": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Basic Zmxvd2FibGUtcmVzdDp0ZXN0"
    }
  }

*/

// https://medium.com/@krishna.acondy/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068

/*

  protected getHttpOptions(params: HttpParams = null) {

    this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      const user: User = this.authService.getUser();

      if (typeof user === 'undefined') {
        this.logger.error('CollectionService getHttpOptions() - user is undefined');
        return this.httpOptions;
      }

      const token = user.username + ':' + user.password;

      this.logger.info('CollectionService getHttpOptions() - token: ' + token);

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(token)
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

*/

/*

// import { Observable, of } from 'rxjs';

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to your remote logging infrastructure e.g., Sentry
      this.logger.error(error);

      // TODO: better job of transforming error for user consumption
      // this.logger.info(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

*/
