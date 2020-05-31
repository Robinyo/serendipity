import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EnvironmentService, LoggerService } from 'utils';
import { ElectoralDivision } from '../../models/electoral-division';
import { CollectionService } from '../abstract/collection/collection.service';

@Injectable({
  providedIn: 'root'
})
export class ElectoralDivisionsService extends CollectionService {

  constructor(private httpClient: HttpClient,
              protected environmentService: EnvironmentService,
              protected logger: LoggerService) {

    super(environmentService, logger);

    this.url = 'http://localhost:' + this.config.serverPort + '/api/electoral-divisions/';
  }

  public findByName(name: string): Promise<ElectoralDivision> {

    const queryParams = '?name=' + name;

    return this.httpClient.get<ElectoralDivision>(this.url + 'search/findByName' + queryParams).toPromise();
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.logger.info('ElectoralDivisionsService: handleError()');

      // TODO: send the error to your remote logging infrastructure e.g., Sentry

      // TODO: better job of transforming error for user consumption
      this.logger.error(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result (i.e., [])
      return of(result as T);
    };
  }

}
