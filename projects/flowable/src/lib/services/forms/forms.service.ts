import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class FormsService extends CollectionService {

  constructor() {

    super();

    this.url = this.getUrlPrefix() + '/form/form-data';
  }

  public submitFormData(body: any): Promise<any> {

    this.logger.info('FormsService: submitFormData()');

    this.logger.info('FormsService submitFormData() - url: ' + this.url);

    return this.httpClient.post(this.url, body, this.getHttpOptions()).pipe(

      tap(() => {

        this.logger.info('FormsService: submitFormData() completed');

      })).toPromise().catch(error => {

      if (error === undefined) {
        error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
      }

      throw error;

    });

  }

}
