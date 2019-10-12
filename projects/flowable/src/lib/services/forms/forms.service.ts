import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

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

    super(authService, logger);
  }

  public submitFormData(body: any): Promise<any> {

    this.logger.info('FormsService: submitFormData()');

    const endpoint = `${this.processEngineUriPrefix}form/form-data`;

    this.httpOptions.params = null;

    this.logger.info('FormsService submitFormData() - endpoint: ' + endpoint);

    return this.httpClient.post(endpoint, body, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('FormsService: submitFormData() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error('Connection refused');
      }

      throw error;

    });

  }

}
