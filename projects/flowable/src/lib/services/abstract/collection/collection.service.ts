import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService, User } from 'auth';

import { LoggerService } from 'utils';

export abstract class CollectionService {

  // private processEngineUriPrefix = 'http://localhost:8080/flowable-task/process-api/runtime/';
  protected processEngineUriPrefix = '/flowable-task/process-api/';

  protected httpOptions = null;

  constructor(protected authService: AuthService,
              protected logger: LoggerService) {

  }

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

}

// https://medium.com/@krishna.acondy/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068

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
