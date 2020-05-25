import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from 'utils';
import { ElectoralDivision } from '../../models/electoral-division';
import { CollectionService } from '../abstract/collection/collection.service';

@Injectable({
  providedIn: 'root'
})
export class ElectoralDivisionsService extends CollectionService {

  constructor(private httpClient: HttpClient,
              protected logger: LoggerService) {

    super(logger);

    this.url = 'http://localhost:3001/api/electoral-divisions/';
  }

  public findByName(name: string): Promise<ElectoralDivision> {

    const queryParams = '?name=' + name;

    return this.httpClient.get<ElectoralDivision>(this.url + 'search/findByName' + queryParams).toPromise();
  }

/*

  public getFormMetadata(formId: string): Promise<DynamicFormControlModel[]> {
    return this.httpClient.get<DynamicFormControlModel[]>(this.uriPrefix + formId + this.uriSuffix).toPromise();
  }

  public findByName(name: string): Observable<ElectoralDivision> {

    const queryParams = '?name=' + name;

    return this.httpClient.get<ElectoralDivision>(this.url + 'search/findByName' + queryParams).pipe(

      tap(() => {
        this.logger.info('ElectoralDivisionsService: findByName() completed');
      }),
      catchError(this.handleError)
    );

  }

*/

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
