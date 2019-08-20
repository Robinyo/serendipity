import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from 'auth';

import { CollectionService } from '../abstract/collection/collection.service';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class FormsService extends CollectionService {

  constructor(protected authService: AuthService,
              protected httpClient: HttpClient,
              protected logger: LoggerService) {

    super(authService, httpClient, logger);
  }

  public submitFormData(body: any): Observable<any> {

    this.logger.info('FormsService: submitFormData()');

    const endpoint = `${this.processEngineUriPrefix}form/form-data`;

    this.httpOptions.params = null;

    this.logger.info('FormsService submitFormData() - endpoint: ' + endpoint);

    return this.httpClient.post<any>(endpoint, body, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('FormsService: submitFormData() completed');
      }),
      catchError(this.handleError('submitFormData', []))
    );

  }

}
