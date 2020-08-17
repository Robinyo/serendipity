import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

import { CollectionService } from 'utils';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class FormsService extends CollectionService {

  constructor() {
    super();
  }

  public submitFormData(body: any): Promise<any> {

    this.logger.info('FormsService: submitFormData()');

    this.url = this.getUrlPrefix() + '/process-api/form/form-data';

    this.logger.info('url: ' + this.url);

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

/*

  protected getUrlPrefix(): string {
    return super.getUrlPrefix() + '/process-api';
  }

*/
